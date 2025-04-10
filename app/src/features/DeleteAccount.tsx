import { Address, OpenedContract, toNano } from "@ton/core";
import { WalletV5 } from "../protocol/wallet_v5";
import { Account } from "../contexts/account";
import { useConnection } from "../hooks/ton";
import { useLoader } from "../contexts/loader";
import { TonContextValue, useTon } from "../contexts/tonClient";
import { useServiceController } from "../contexts/serviceController";
import { useCallback } from "react";
import React from "react";

const DeleteAccount = (account: Account, wallet: OpenedContract<WalletV5>) => {
  if (!account.deployed) return;

  const conn = useConnection();
  const loader = useLoader();
  const ton = useTon();

  const controller = useServiceController();

  const deleteAccount = useCallback(async () => {
    if (!account) return;
    if (!conn) return;
    if (!wallet) return;
    if (!controller) return;

    loader.show("Creating account. Sending transaction.");

    await account.contract.send(
      conn.sender,
      {
        value: toNano("0.05"),
      },
      {
        $$type: "AccountDelete",
      }
    );

    loader.show("Deleting account. Waiting for transaction to settle.");
    // await waitTillExists(ton, account.contract.address);
    loader.hide();
    // onAccountChange();
  }, [account]);

  return (
    <button className="btn" onClick={deleteAccount}>
      DELETE ACCOUNT
    </button>
  );
};
