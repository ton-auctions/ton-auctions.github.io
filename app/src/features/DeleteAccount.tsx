import { Address, OpenedContract, toNano } from "@ton/core";
import { WalletV5 } from "../protocol/wallet_v5";
import { DeployedAccount } from "../contexts/account";
import { useConnection } from "../hooks/ton";
import { useLoader } from "../contexts/loader";
import { useServiceController } from "../contexts/serviceController";
import { useCallback } from "react";
import React from "react";
import { TonContextValue, useTon } from "../contexts/tonClient";

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
    await waitTillExists(ton, account.contract.address);
    loader.hide();
    refreshAccount();
  }, [account]);

  return (
    <button className="btn btn-secondary" onClick={deleteAccount}>
      DELETE ACCOUNT
    </button>
  );
};
