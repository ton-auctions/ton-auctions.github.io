import { Address, OpenedContract, toNano } from "@ton/core";
import { WalletV5 } from "../protocol/wallet_v5";
import { DeployedAccount } from "../contexts/account";
import { useConnection } from "../hooks/ton";
import { useLoader } from "../contexts/loader";
import { useServiceController } from "../contexts/serviceController";
import { useCallback } from "react";
import React from "react";
import { TonContextValue, useTon } from "../contexts/tonClient";
import { loadAccountDelete } from "../protocol/tact_Account";
import { useAlerts } from "../contexts/alerts";

type DeleteAccountProps = {
  account: DeployedAccount;
  refreshAccount: () => void;
  wallet: OpenedContract<WalletV5>;
};

const waitTillExists = async (client: TonContextValue, src: Address) => {
  let contractExists = true;
  while (contractExists) {
    contractExists = await client.client.isContractDeployed(src);
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
};

export const DeleteAccount: React.FC<DeleteAccountProps> = ({
  account,
  refreshAccount,
  wallet,
}) => {
  const conn = useConnection();
  const loader = useLoader();
  const alerts = useAlerts();
  const ton = useTon();

  const controller = useServiceController();

  const deleteAccount = useCallback(async () => {
    if (!account) return;
    if (!conn) return;
    if (!wallet) return;
    if (!controller) return;

    loader.show("Deleting account. Sending transaction.");

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
              $$type: "AccountDelete",
            }
          );
        },
        testMessage: (cell) => {
          loadAccountDelete(cell.asSlice());
        },
        updateLoader: (text) => loader.show(`Deleting account. ${text}`),
      })
      .catch((e) => {
        alerts.addAlert(`Can't delete account. ${e}`, 5000);
      })
      .finally(() => loader.hide())
      .then(() => {
        refreshAccount();
      });
  }, [account, conn, wallet, controller]);

  return (
    <button className="btn btn-secondary grow m-5" onClick={deleteAccount}>
      DELETE ACCOUNT
    </button>
  );
};
