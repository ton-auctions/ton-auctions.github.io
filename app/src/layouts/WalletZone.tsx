import React, { useState } from "react";
import { Outlet } from "react-router";

import { NavbarContextProvider } from "../contexts/navbar";

import { Navbar } from "../features/Navbar";
import { WalletContextProvider } from "../contexts/wallet";

interface WalletZoneProps {
  noRedirect?: boolean;
}

export const WalletZone: React.FC<WalletZoneProps> = ({ noRedirect }) => {
  const [showBurger, setShowBurger] = useState(false);

  return (
    <>
      <WalletContextProvider redirectTo={noRedirect ? undefined : "/connect"}>
        <NavbarContextProvider setShowBurger={setShowBurger}>
          <Outlet />
        </NavbarContextProvider>
        <Navbar withBurger={showBurger} />
      </WalletContextProvider>
    </>
  );
};
