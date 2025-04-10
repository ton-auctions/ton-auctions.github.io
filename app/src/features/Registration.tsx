import { useLoader } from "../contexts/loader";
import { useConnection } from "../hooks/ton";
import { useServiceController } from "../contexts/serviceController";
import { useTon } from "../contexts/tonClient";
import { useWalletContract } from "./ConnectWallet";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { Address, toNano } from "@ton/ton";
import React from "react";
import { useUserAccount } from "../contexts/account";
import { useLocation, useNavigate, useParams } from "react-router";

function useReferreeAddress(
  key: string
): [Address | null, React.Dispatch<React.SetStateAction<Address | null>>] {
  const [value, setValue] = useState<Address | null>(() => {
    try {
      const val = localStorage.getItem(key);
      return Address.parse(val || "");
    } catch (e) {
      // TODO: Do smth
      localStorage.removeItem(key);
      return null;
    }
  });

  useEffect(() => {
    const oldValue = localStorage.getItem(key);

    if (oldValue !== null) return;
    if (value === null) return;

    localStorage.setItem(key, value.toString());
  }, [key, value]);

  return [value, setValue];
}

export const Registration: React.FC<{}> = () => {
  const loader = useLoader();

  const { refreshAccount } = useUserAccount();

  const connection = useConnection();
  const controller = useServiceController();
  const location = useLocation();
  const params = useParams();
  const [referree, setReferee] = useReferreeAddress("referree");

  const navigate = useNavigate();

  const ton = useTon();
  const wallet = useWalletContract(ton);

  useEffect(() => {
    if (referree !== null) return;

    let referreeAddress: Address | null = null;
    try {
      referreeAddress = Address.parse(params.ref || "");
      setReferee(referreeAddress);
    } catch (e) {
      // TODO: Do smth
    }
  }, [params]);

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
          referree,
        }
      );
    } catch (e) {
      // TODO: manually test for insufficient TON
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

  return (
    <div className="max-h-dvh min-w-xs flex h-full flex-col">
      <div className="flex flex-none h-18 justify-center"></div>

      <div className="flex flex-none justify-center z-10">
        <button className="btn" onClick={register}>
          REGISTRATION {referree?.toString()}
        </button>
      </div>
    </div>
  );
};
