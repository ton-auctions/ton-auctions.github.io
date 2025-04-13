import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

import { toNano } from "@ton/core";

import { useLoader } from "../contexts/loader";
import { useConnection } from "../hooks/ton";
import { useServiceController } from "../contexts/serviceController";
import { useTon } from "../contexts/tonClient";
import { useWalletContract } from "./ConnectWallet";

import { useUserAccount } from "../contexts/account";
import { useAlerts } from "../contexts/alerts";

import { loadCleanInitialiser } from "../protocol/tact_Account";

export const CleanButton: React.FC<{}> = () => {
  const loader = useLoader();
  const alerts = useAlerts();
  const ton = useTon();

  const { refreshAccount } = useUserAccount();

  const connection = useConnection();
  const controller = useServiceController();
  const location = useLocation();
  const wallet = useWalletContract(ton);
  const navigate = useNavigate();

  const clean = useCallback(async () => {
    if (!controller.loaded) return;
    if (!wallet) return;

    loader.show("Creating account.");
    ton
      .signSendAndWait({
        checkAddress: wallet.address,
        checkTransactionFrom: controller.contract.address,
        checkTimeout: 10000,
        send: async () => {
          await controller.contract.send(
            connection.sender,
            { value: toNano("0.05"), bounce: true },
            {
              $$type: "CleanInitialiser",
              address: wallet.address,
            }
          );
        },
        updateLoader: (text) => loader.show(`Creating account. ${text}`),
        testMessage: (cell) => loadCleanInitialiser(cell.asSlice()),
      })
      .catch((e) => {
        alerts.addAlert(`Something went wrong. ${e}.`, 5000);
      })
      .finally(() => {
        loader.hide();
      })
      .then(() => {
        refreshAccount();
        loader.hide();
        navigate(location.state.forward || "/app/account");
      });
  }, [controller, wallet]);

  return (
    <button className="btn btn-secondary" onClick={clean}>
      Clean
    </button>
  );
};
