import * as React from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";

export const ConnectWallet = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();

  const imageUrl = new URL(
    "/public/logo_t.png?as=webp&width=250",
    import.meta.url
  );

  return (
    <>
      <div className="flex grow z-10"></div>

      <div className="flex justify-center items-center z-10 text-center text-gray-100">
        <img className="w-50 h-50" src={imageUrl.pathname} alt="heh" />
      </div>

      <div className="flex justify-center items-center z-10 text-center">
        <p className="font-bold text-7xl text-gray-100">BidTon</p>
      </div>

      <div className="flex justify-center z-10">
        <button
          className="text-gray-100 p-5"
          onClick={async () => {
            await tonConnectUI.openModal();
          }}
        >
          Connect Wallet
        </button>
      </div>
      <div className="flex grow z-10"></div>
    </>
  );
};
