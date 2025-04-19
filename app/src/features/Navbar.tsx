import React, { useCallback } from "react";
import { useNavigate } from "react-router";

import { useAccountContext } from "../contexts/account";
import { useWalletContext } from "../contexts/wallet";

import Exit from "../assets/exit.svg";
import Burger from "../assets/burger.svg";

interface NavbarProps {
  withBurger: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ withBurger }) => {
  const wallet = useWalletContext();
  const navigate = useNavigate();
  const { dropAccount } = useAccountContext();

  const disconnect = useCallback(async () => {
    if (!wallet.connected) return;

    await wallet.disconnect();
    dropAccount();
    await navigate("/connect", { state: { forward: undefined } });
  }, [wallet]);

  return (
    <div className="navbar absolute bg-base-300 shadow-sm max-h-dvh min-w-xs">
      <label
        hidden={!withBurger}
        htmlFor="my-drawer"
        className="p-3 btn btn-link"
      >
        <Burger width="30" height="30" />
      </label>
      <div className="flex-1 text-xl pl-2">BidTon</div>
      {wallet && wallet.connected && (
        <div className="flex-none pr-2 btn btn-link" onClick={disconnect}>
          <Exit width="30" height="30" />
        </div>
      )}
    </div>
  );
};
