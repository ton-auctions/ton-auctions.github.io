import {
  Address,
  Cell,
  Contract,
  OpenedContract,
  Transaction,
} from "@ton/core";
import { TonClient } from "@ton/ton";
import { Moment } from "moment";
import React from "react";
import { useContext } from "react";
import { createContext } from "react";
import { proxy, useSnapshot } from "valtio";

type ClientState = {
  apiKey?: string;
};

const clientState = proxy<ClientState>({});

export type TonContextValue = {
  client: TonClient;

  cachedOpenContract: <T extends Contract>(src: T) => OpenedContract<T>;

  waitForTransactions: (params: {
    at_address: Address;
    from?: Address;
    after_ts: Moment;
    lt?: string;
    hash?: string;
    timeout?: number;
    limit?: number;
    testMessage?: (cell: Cell) => boolean;
  }) => Promise<Transaction[]>;

  signSendAndWait: (params: {
    checkAddress: Address;
    checkTransactionFrom: Address;
    checkTimeout?: number;
    send: () => Promise<void>;
    updateLoader: (operation: string) => void;
    testMessage: (cell: Cell) => void;
  }) => Promise<void>;

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

const createContextValue = (endpointV2: string, apiKey?: string) => {
  const client = new TonClient({ endpoint: endpointV2, apiKey });
  const _cache = new Map<string, any>();
  const ton = {
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

    waitForTransactions: async (params: {
      at_address: Address;
      from?: Address;
      startingTx?: Transaction;
      timeout?: number;
      limit?: number;
      testMessage?: (cell: Cell) => void;
    }) => {
      var tx: Transaction[] = [];
      while (tx.length == 0) {
        try {
          const all_txs = await client.getTransactions(params.at_address, {
            limit: params.limit ?? 5,
          });

          const new_txs = all_txs
            .filter((tx) => {
              return !params.startingTx || tx.lt > params.startingTx.lt;
            })
            .filter(
              (tx) =>
                !params.from ||
                tx.inMessage?.info.src?.toString() == params.from.toString()
            )
            .filter(
              (tx) =>
                !params.at_address ||
                tx.inMessage?.info.dest?.toString() ==
                  params.at_address.toString()
            )
            .filter((tx) => {
              if (!params.testMessage) return true;
              if (!tx.inMessage) return false;
              try {
                params.testMessage(tx.inMessage?.body);
              } catch (e) {
                return false;
              }
              return true;
            });

          if (new_txs.length > 0) {
            return new_txs;
          }
          await new Promise((resolve) =>
            setTimeout(resolve, params.timeout || 1000)
          );
        } catch (e) {
          await new Promise((resolve) =>
            setTimeout(resolve, params.timeout || 1000)
          );
        }
      }
      return [];
    },

    signSendAndWait: async (params: {
      checkAddress: Address;
      checkTransactionFrom: Address;
      checkTimeout?: number;
      send: () => Promise<void>;
      updateLoader: (operation: string) => void;
      testMessage: (cell: Cell) => void;
    }) => {
      // TODO: move somewhere else. Probably create a folder for callback factories.
      params.updateLoader("Signing transaction.");

      const state = await ton.client.getContractState(params.checkAddress);

      const tx =
        state.state == "uninitialized"
          ? [undefined]
          : await ton.waitForTransactions({
              at_address: params.checkAddress,
              limit: 1,
              timeout: params.checkTimeout ?? 1000,
            });

      await params.send();

      params.updateLoader("Waiting for transaction to settle.");

      await ton.waitForTransactions({
        at_address: params.checkAddress,
        from: params.checkTransactionFrom,
        startingTx: tx[0],
        testMessage: params.testMessage,
        limit: 10,
        timeout: params.checkTimeout ?? 1000,
      });
    },
  };
  return ton;
};

export const TonClientContext = createContext<TonContextValue>(
  createContextValue("https://testnet.toncenter.com/api/v2/jsonRPC")
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
      value={createContextValue(endpointV2, state.apiKey)}
    >
      {children}
    </TonClientContext.Provider>
  );
};

export const useTon = () => useContext(TonClientContext);
