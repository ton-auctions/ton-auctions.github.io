import { Address, toNano } from "@ton/core";
import { useLoader } from "../contexts/loader";
import { useAlerts } from "../contexts/alerts";
import { useUserAccount } from "../contexts/account";
import { useConnection } from "../hooks/ton";
import { useServiceController } from "../contexts/serviceController";
import { useLocation, useNavigate } from "react-router";
import { useTon } from "../contexts/tonClient";
import { useWalletContract } from "./ConnectWallet";
import { useCallback } from "react";
import { getAccountWrapper } from "../utils/addresses";
import { loadInitialize } from "../protocol/tact_Account";
import React from "react";

interface RegisterButtonProps {
  referree?: Address;
}

export const RegisterButton: React.FC<RegisterButtonProps> = ({ referree }) => {
  const loader = useLoader();
  const alerts = useAlerts();

  const connection = useConnection();
  const controller = useServiceController();
  const location = useLocation();

  const navigate = useNavigate();

  const ton = useTon();
  const wallet = useWalletContract(ton);

  const register = useCallback(async () => {
    if (!controller.loaded) return;
    if (!wallet) return;

    const accountWrapper = await getAccountWrapper(
      controller.contract,
      wallet.address
    );

    loader.show("Creating account.");
    ton
      .signSendAndWait({
        checkAddress: accountWrapper.address,
        checkTransactionFrom: controller.contract.address,
        checkTimeout: 10000,
        send: async () => {
          await controller.contract.send(
            connection.sender,
            { value: toNano("0.1"), bounce: true },
            {
              $$type: "CreateAccount",
              chat_id: 0n, // TODO: debug miniapp finally.
              referree: referree || null,
            }
          );
        },
        updateLoader: (text) => loader.show(`Creating account. ${text}`),
        testMessage: (cell) => loadInitialize(cell.asSlice()),
      })
      .catch((e) => {
        alerts.addAlert("Error", `Something went wrong. ${e}.`, 5000);
      })
      .finally(() => {
        loader.hide();
      })
      .then(() => {
        loader.hide();
        navigate(location.state.forward || "/app/account");
      });
  }, [controller, wallet]);

  return (
    <button className="btn btn-primary w-full" onClick={register}>
      Register Me
    </button>
  );
};
