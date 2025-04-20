import { Address, beginCell, Dictionary, OpenedContract } from "@ton/core";
import { Account, Controller } from "../protocol";

export const getAccountWrapper = async (
  controller: OpenedContract<Controller>,
  address: Address
) => {
  return await Account.fromInit({
    $$type: "AccountData",
    version: 1n,
    collector: controller.address,
    allowance: 0n,
    max_allowance: 0n,
    auctions: Dictionary.empty(),
    balance: null,
    initialised: false,
    owner: address,
    referral_comission: 0n,
    service_comission: 0n,
    referree: null,
    secret_id: beginCell().endCell(),
  });
};
