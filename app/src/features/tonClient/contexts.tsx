import { Address, Contract, OpenedContract, TonClient } from "@ton/ton";
import React from "react";
import { createContext } from "react";
import { proxy, useSnapshot } from "valtio";
import axios from "axios";
import * as types from "./toncenter_v3_types";

type ClientState = {
  apiKey?: string;
};

const clientState = proxy<ClientState>({});

export type TonContextValue = {
  client: TonClient;

  cachedOpenContract: <T extends Contract>(src: T) => OpenedContract<T>;

  getTransactions: (address: Address, lt_from: bigint) => Promise<Tx[]>;

  setApiKey: (apiKey: string) => void;
};

export type Message = {
  hash: Buffer<ArrayBufferLike>;
  source: Address;
  destination: Address;
  value: bigint;
  bounce: boolean;
  bounced: boolean;
};

export type Tx = {
  account: Address;
  lt: bigint;
  hash: Buffer<ArrayBufferLike>;
  now: number;
  end_status: string; // TODO: enum?
  in: Message;
};

const createContextValue = (
  endpointV2: string,
  endpointV3: string,
  apiKey?: string
) => {
  const client = new TonClient({ endpoint: endpointV2, apiKey });
  const _cache = new Map<string, any>();
  return {
    client: client,
    cachedOpenContract: <T extends Contract>(src: T): OpenedContract<T> => {
      const key = `open_${src.address.toString()}`;

      if (!_cache.has(key)) {
        _cache.set(key, client.open(src));
      }

      return _cache.get(key);
    },
    setApiKey: (apiKey: string) => {
      if (clientState.apiKey == apiKey) return;

      clientState.apiKey = apiKey;
    },
    getTransactions: async (address: Address, lt_from: bigint) => {
      const response = await axios({
        method: "get",
        url: `${endpointV3}transactions`,
        params: {
          account: address.toString(),
          start_lt: lt_from.toString(),
        },
      });

      const data: types.ToncenterV3ApiGetTransactionsResponse = response.data;

      const result = data.transactions
        .map((tx) => {
          if (!tx.in_msg.destination) return;
          if (!tx.in_msg.source) return;

          const inMessage: Message = {
            hash: Buffer.from(tx.in_msg.hash, "base64"),
            destination: Address.parseRaw(tx.in_msg.destination),
            source: Address.parseRaw(tx.in_msg.source),
            value: BigInt(tx.in_msg.value),
            bounce: tx.in_msg.bounce,
            bounced: tx.in_msg.bounced,
          };

          return {
            account: Address.parseRaw(tx.account),
            lt: BigInt(tx.lt),
            hash: Buffer.from(tx.hash, "base64"),
            now: tx.now,
            end_status: tx.end_status,
            in: inMessage,
          } as Tx;
        })
        .filter((el) => el !== undefined);

      return result;
    },
  };
};

export const TonClientContext = createContext<TonContextValue>(
  createContextValue(
    "https://testnet.toncenter.com/api/v2/jsonRPC",
    "https://testnet.toncenter.com/api/v3/"
  )
);

type TonClientProviderProps = React.PropsWithChildren & {
  endpointV2: string;
  endpointV3: string;
  apiKey: string;
};

export const TonClientProvider: React.FC<TonClientProviderProps> = ({
  children,
  endpointV2,
  endpointV3,
  apiKey,
}) => {
  clientState.apiKey = clientState.apiKey || apiKey;

  const state = useSnapshot(clientState);

  return (
    <TonClientContext.Provider
      value={createContextValue(endpointV2, endpointV3, state.apiKey)}
    >
      {children}
    </TonClientContext.Provider>
  );
};
