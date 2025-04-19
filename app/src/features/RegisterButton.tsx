import { Address, beginCell, toNano } from "@ton/core";
import { useLoaderContext } from "../contexts/loader";
import { useAlertsContext } from "../contexts/alerts";
import { useConnection } from "../hooks/ton";
import { useServiceControllerContext } from "../contexts/serviceController";
import { useLocation, useNavigate } from "react-router";
import { useTonContext } from "../contexts/tonClient";
import { useWalletContract } from "./ConnectWallet";
import { useCallback } from "react";
import { getAccountWrapper } from "../utils/addresses";
import { loadInitialise } from "../protocol/tact_Account";
import React from "react";
import { redirectToTg, useEncryptedUserId } from "../hooks/launchParams";

interface RegisterButtonProps {
  referree?: Address;
}

export const RegisterButton: React.FC<RegisterButtonProps> = ({ referree }) => {
  const loader = useLoaderContext();
  const alerts = useAlertsContext();

  const connection = useConnection();
  const controller = useServiceControllerContext();

  const navigate = useNavigate();
  const location = useLocation();
  const encryptedUserId = useEncryptedUserId();

  const ton = useTonContext();
  const wallet = useWalletContract(ton);

  const register = useCallback(async () => {
    if (!controller.loaded) return;
    if (!wallet) return;

    const accountWrapper = await getAccountWrapper(
      controller.contract,
      wallet.address
    );

    if (!encryptedUserId) {
      redirectToTg(location.pathname);
      return;
    }

    console.log(encryptedUserId);

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
              secret_id: beginCell().storeBuffer(encryptedUserId).endCell(),
              referree: referree || null,
            }
          );
        },
        updateLoader: (text) => loader.show(`Creating account. ${text}`),
        testMessage: (cell) => loadInitialise(cell.asSlice()),
      })
      .then(() => {
        navigate(location.state.forward || "/app/account", {
          state: { forward: undefined },
        });
      })
      .catch((e) => {
        alerts.addAlert("Error", `Something went wrong. ${e}.`, 5000);
      })
      .finally(() => {
        loader.hide();
      });
  }, [controller, wallet, encryptedUserId]);

  return (
    <button className="btn btn-primary w-full" onClick={register}>
      Register Me
    </button>
  );
};
