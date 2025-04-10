import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import React, { useCallback } from "react";
import Exit from "../assets/exit.svg";
import { useNavigate } from "react-router";

export const Navbar = () => {
  const wallet = useTonWallet();
  const [ui] = useTonConnectUI();
  const navigate = useNavigate();

  const disconnect = useCallback(() => {
    console.log("DISCONNECT");
    ui.disconnect();
    navigate("/");
  }, []);

  return (
    <div className="navbar absolute bg-base-300 shadow-sm min-height">
      <label htmlFor="my-drawer" className="p-3 hover:darken">
        <svg
          width="22px"
          height="22px"
          viewBox="0 0 12 12"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <rect fill="#FFF" height="1" width="11" x="0.5" y="5.5" />
            <rect fill="#FFF" height="1" width="11" x="0.5" y="2.5" />
            <rect fill="#FFF" height="1" width="11" x="0.5" y="8.5" />
          </g>
        </svg>
      </label>
      <div className="flex-1 text-xl pl-2">BidTon</div>
      {wallet && (
        <div className="flex-none pr-2" onClick={disconnect}>
          <Exit width="30" height="30" />
        </div>
      )}
    </div>
  );
};
