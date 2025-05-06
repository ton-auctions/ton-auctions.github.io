export interface Network {
  name: string;
  toncenter: string;
  keys: () => string[];
  workchain: number;
  shard: string;
  startsFrom: number;
}

export const NETWORKS: { [key: string]: Network } = {
  MAINNET: {
    name: "mainnet",
    toncenter: "https://toncenter.com",
    workchain: 0,
    shard: "-9223372036854775808",
    keys: () => {
      const envVal = Deno.env.get("MAINNET_KEYS") || "";
      return envVal.split(",");
    },
    startsFrom: 1,
  },
  TESTNET: {
    name: "testnet",
    toncenter: "https://testnet.toncenter.com",
    workchain: 0,
    shard: "6000000000000000",
    keys: () => {
      const envVal = Deno.env.get("TESTNET_KEYS") || "";
      return envVal.split(",");
    },
    startsFrom: 1,
  },
};
