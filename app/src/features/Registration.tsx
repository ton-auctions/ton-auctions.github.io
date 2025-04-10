import { useTonConnectUI } from "@tonconnect/ui-react";
import { useLoader } from "../contexts/loader";
import { useConnection } from "../hooks/ton";
import { useServiceController } from "../contexts/serviceController";
import { useTon } from "../contexts/tonClient";
import { useWalletContract } from "./ConnectWallet";
import { useCallback } from "react";
import moment from "moment";
import { toNano } from "@ton/ton";
import React from "react";
import { useUserAccount } from "../contexts/account";
import { useLocation, useNavigate } from "react-router";

export const Registration: React.FC<{}> = () => {
  const loader = useLoader();

  const { refreshAccount } = useUserAccount();
  const [ui] = useTonConnectUI();
  const connection = useConnection();
  const controller = useServiceController();
  const location = useLocation();
  const navigate = useNavigate();

  const ton = useTon();
  const wallet = useWalletContract(ton);

  const register = useCallback(async () => {
    if (!controller.loaded) return;
    if (!wallet) return;

    loader.show("Creating account. Sending transaction.");

    // At least wallet creation transaction should exist.
    const tx = await ton.waitForTransactions({
      at_address: controller.contract.address,
      after_ts: moment(0),
      limit: 1,
      timeout: 1000,
    });

    try {
      await controller.contract.send(
        connection.sender,
        { value: toNano("0.1"), bounce: true },
        {
          $$type: "CreateAccount",
          chat_id: 0n,
          referree: null,
        }
      );
    } catch (e) {
      // TODO: manually test for insufficient TON
      console.log("JOPA");
    }

    loader.show("Creating account. Waiting for transation to settle.");

    await ton.waitForTransactions({
      at_address: controller.contract.address,
      after_ts: moment(tx[0].now),
      lt: tx[0].lt.toString(),
      hash: tx[0].hash().toString("base64"),
      src: wallet.address,
      dest: controller.contract.address,
      timeout: 10000,
    });

    refreshAccount();
    loader.hide();
    navigate(location.state.forward || "app");
  }, [controller, wallet]);

  const disconnect = useCallback(() => {
    ui.disconnect();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="text-gray-100">
        <button className="btn" onClick={register}>
          REGISTRATION
        </button>
      </div>
      <div className="text-gray-100">
        <button className="btn" onClick={disconnect}>
          DISSCONNECT
        </button>
      </div>
    </div>
  );
};
