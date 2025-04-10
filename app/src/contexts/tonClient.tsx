import {
  Address,
  Contract,
  OpenedContract,
  TonClient,
  Transaction,
} from "@ton/ton";
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
    after_ts: Moment;
    lt?: string;
    hash?: string;
    timeout?: number;
    src?: Address;
    dest?: Address;
    limit?: number;
  }) => Promise<Transaction[]>;

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

    waitForTransactions: async (params: {
      at_address: Address;
      after_ts: Moment;
      lt?: string;
      hash?: string;
      timeout?: number;
      src?: Address;
      dest?: Address;
      limit?: number;
    }) => {
      var tx: Transaction[] = [];
      while (tx.length == 0) {
        try {
          const all_txs = await client.getTransactions(params.at_address, {
            limit: params.limit ?? 5,
            lt: params.lt,
            hash: params.hash,
          });

          const new_txs = all_txs
            .filter((tx) => tx.now >= params.after_ts.unix())
            .filter((tx) => {
              console.log(
                "SRC",
                tx.inMessage?.info.src?.toString(),
                params.src?.toString()
              );

              return (
                !params.src ||
                tx.inMessage?.info.src?.toString() == params.src.toString()
              );
            })
            .filter((tx) => {
              console.log(
                "DST",
                tx.inMessage?.info.dest?.toString(),
                params.dest?.toString()
              );

              return (
                !params.dest ||
                tx.inMessage?.info.dest?.toString() == params.dest.toString()
              );
            });

          if (new_txs.length > 0) {
            console.log("new_txs", new_txs);
            return new_txs;
          }
        } catch (e) {
          // ignore
        } finally {
          await new Promise((resolve) =>
            setTimeout(resolve, params.timeout || 1000)
          );
        }
      }
      return [];
    },
  };
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

// getTransactions: async (address: Address, lt_from: bigint) => {
//   const response = await axios({
//     method: "get",
//     url: `${endpointV3}transactions`,
//     params: {
//       account: address.toString(),
//       start_lt: lt_from.toString(),
//     },
//   });

//   const data = response.data;

//   const result = data.transactions
//     .map((tx) => {
//       console.log(tx);

//       if (!tx.in_msg.destination) return;
//       if (!tx.in_msg.source) return;

//       const inMessage: Message = {
//         hash: Buffer.from(tx.in_msg.hash, "base64"),
//         destination: Address.parseRaw(tx.in_msg.destination),
//         source: Address.parseRaw(tx.in_msg.source),
//         value: BigInt(tx.in_msg.value),
//         bounce: tx.in_msg.bounce,
//         bounced: tx.in_msg.bounced,
//       };

//       return {
//         account: Address.parseRaw(tx.account),
//         lt: BigInt(tx.lt),
//         hash: Buffer.from(tx.hash, "base64"),
//         now: tx.now,
//         end_status: tx.end_status,
//         in: inMessage,
//       } as Tx;
//     })
//     .filter((el) => el !== undefined);

//   return result;
// },
// };

export const useTon = () => useContext(TonClientContext);
