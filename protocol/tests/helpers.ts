import { toNano } from "@ton/core";

export const isCloseTo = (cmp: bigint) => {
  return (value: bigint | undefined) => {
    if (!value) return false;

    const diff = cmp > value ? cmp - value : value - cmp;

    return diff < toNano("0.01");
  };
};
