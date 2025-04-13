import React from "react";
import { useCallback } from "react";
import { OpenedContract, toNano } from "@ton/core";

import { DeployedAccount } from "../contexts/account";
import { useLoader } from "../contexts/loader";
import { useAlerts } from "../contexts/alerts";
import { useTon } from "../contexts/tonClient";
import { useServiceController } from "../contexts/serviceController";

import { useConnection } from "../hooks/ton";

import { WalletV5 } from "../protocol/wallet_v5";
import { loadAccountDelete } from "../protocol/tact_Account";

interface CollectAccountProps {
  account: DeployedAccount;
  refreshAccount: () => void;
  wallet: OpenedContract<WalletV5>;
}

// TODO: create account action and use it for delete and connect
// same with auction
export const CollectAccount: React.FC<CollectAccountProps> = ({
  account,
  refreshAccount,
  wallet,
}) => {
  const conn = useConnection();
  const loader = useLoader();
  const alerts = useAlerts();
  const ton = useTon();

  const controller = useServiceController();

  const collectAccount = useCallback(async () => {
    if (!account) return;
    if (!conn) return;
    if (!wallet) return;
    if (!controller) return;

    loader.show("Collecting moneys. Sending transaction.");

    ton
      .signSendAndWait({
        checkAddress: account.contract.address,
        checkTransactionFrom: wallet.address,
        checkTimeout: 10000,
        send: async () => {
          await account.contract.send(
            conn.sender,
            {
              value: toNano("0.05"),
            },
            {
              $$type: "Collect",
              amount: 0n, // TODO: delete
            }
          );
        },
        testMessage: (cell) => {
          loadAccountDelete(cell.asSlice());
        },
        updateLoader: (text) => loader.show(`Collecting. ${text}`),
      })
      .catch((e) => {
        alerts.addAlert("Error", `Can't collect moneys. ${e}`, 5000);
      })
      .finally(() => loader.hide())
      .then(() => {
        refreshAccount();
      });
  }, [account, conn, wallet, controller]);

  return (
    <button className="btn btn-secondary grow" onClick={collectAccount}>
      COLLECT {(Number(account.data.balance) / 1000000000).toFixed(1)} TON
    </button>
  );
};
