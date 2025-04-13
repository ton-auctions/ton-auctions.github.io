import { Address, Dictionary, OpenedContract } from "@ton/core";
import { Account, Controller } from "../protocol";

export const getAccountWrapper = async (
  controller: OpenedContract<Controller>,
  address: Address
) => {
  return await Account.fromInit(
    controller.address,
    address,
    null,
    0n,
    0n,
    0n,
    Dictionary.empty(),
    0n,
    0n,
    false
  );
};
