import React, { useCallback } from "react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useNavigate } from "react-router";

import Exit from "../assets/exit.svg";
import Burger from "../assets/burger.svg";
import { useUserAccount } from "../contexts/account";

interface NavbarProps {
  withBurger: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ withBurger }) => {
  const wallet = useTonWallet();
  const [ui] = useTonConnectUI();
  const navigate = useNavigate();
  const { dropAccount } = useUserAccount();

  const disconnect = useCallback(async () => {
    await ui.disconnect();
    dropAccount();
    navigate("/");
  }, [dropAccount]);

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
      {wallet && (
        <div className="flex-none pr-2 btn btn-link" onClick={disconnect}>
          <Exit width="30" height="30" />
        </div>
      )}
    </div>
  );
};
