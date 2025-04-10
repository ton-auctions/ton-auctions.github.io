import * as React from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { TonContextValue } from "../contexts/tonClient";
import { useState } from "react";
import { Address, OpenedContract } from "@ton/core";
import { WalletV5 } from "../protocol/wallet_v5";
import { useTonWallet } from "@tonconnect/ui-react";
import { useEffect } from "react";
import { useLoader } from "../contexts/loader";

type ServiceWallet = OpenedContract<WalletV5> | undefined;

export const useWalletContract = (ton: TonContextValue) => {
  const [walletContract, setWalletContract] = useState<ServiceWallet>();

  const wallet = useTonWallet();

  useEffect(() => {
    if (!wallet) return;

    setWalletContract(
      ton.cachedOpenContract(
        WalletV5.createFromAddress(Address.parse(wallet.account.address))
      )
    );
  });

  return walletContract;
};

export const ConnectWallet = () => {
  const [tonConnectUI, _] = useTonConnectUI();
  const wallet = useTonWallet();
  const loader = useLoader();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loader.show("Checking connection");
    tonConnectUI.connectionRestored.then((restored) => {
      loader.hide();
      if (restored) {
        navigate(location.state.forward);
      }
    });
  }, [tonConnectUI]);

  if (wallet !== null) {
    return <Navigate to={location.state.forward ?? "app"} />;
  }

  const imageUrl = new URL(
    "/public/logo_t.png?as=webp&width=250",
    import.meta.url
  );

  return (
    <div className="flex h-full flex-col">
      <div className="grow z-10"></div>

      <div className="flex flex-none justify-center items-center z-10 text-center text-gray-100">
        <img className="w-50 h-50" src={imageUrl.pathname} alt="heh" />
      </div>

      <div className="flex flex-none justify-center items-center z-10 text-center mt-5">
        <p className="font-bold text-7xl text-gray-100">BidTon</p>
      </div>

      <div className="flex flex-none justify-center z-10">
        <button
          className="btn btn-primary text-gray-100 p-5 mt-5"
          onClick={async () => {
            await tonConnectUI.openModal();
          }}
        >
          Connect Wallet
        </button>
      </div>
      <div className="grow z-10"></div>
    </div>
  );
};
