import React from "react";
import { useCallback } from "react";
import { OpenedContract, toNano } from "@ton/core";

import { DeployedAccount } from "../contexts/account";
import { useLoaderContext } from "../contexts/loader";
import { useAlertsContext } from "../contexts/alerts";
import { useTonContext } from "../contexts/tonClient";
import { useServiceControllerContext } from "../contexts/serviceController";

import { useConnection } from "../hooks/ton";

import { WalletV5 } from "../protocol/wallet_v5";

interface DeleteAccountProps {
  account: DeployedAccount;
  refreshAccount: () => void;
  wallet: OpenedContract<WalletV5>;
}

export const DeleteAccount: React.FC<DeleteAccountProps> = ({
  account,
  refreshAccount,
  wallet,
}) => {
  const conn = useConnection();
  const loader = useLoaderContext();
  const alerts = useAlertsContext();
  const ton = useTonContext();

  const controller = useServiceControllerContext();

  const deleteAccount = useCallback(async () => {
    if (!account) return;
    if (!conn) return;
    if (!wallet) return;
    if (!controller) return;

    loader.show("Deleting account. Sending transaction.");

    ton
      .signSendAndWaitForDestuction({
        checkAddress: account.contract.address,
        checkTimeout: 10000,
        send: async () => {
          await account.contract.send(
            conn.sender,
            {
              value: toNano("0.05"),
            },
            {
              $$type: "AccountDelete",
            }
          );
        },
        updateLoader: (text) => loader.show(`Deleting account. ${text}`),
      })
      .catch((e) => {
        alerts.addAlert("Error", `Can't delete account. ${e}`, 5000);
      })
      .finally(() => loader.hide())
      .then(() => {
        refreshAccount();
      });
  }, [account, conn, wallet, controller]);

  return (
    <button className="btn btn-secondary grow" onClick={deleteAccount}>
      DELETE ACCOUNT
    </button>
  );
};
