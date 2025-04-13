import React, { useEffect, useState } from "react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Outlet, useLocation, useNavigate } from "react-router";

import { useLoader } from "../contexts/loader";
import { NavbarContextProvider } from "../contexts/navbar";

import { Navbar } from "../features/Navbar";

export const WalletZone = () => {
  const [ui] = useTonConnectUI();
  const wallet = useTonWallet();
  const loader = useLoader();

  const [showBurger, setShowBurger] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loader.show("Checking wallet connection");

    ui.connectionRestored
      .then(async (restored) => {
        if (restored) return;

        if (!wallet) {
          await navigate("/connect", { state: { forward: location.pathname } });
        }
      })
      .catch(() => {
        // TODO: work it out.
      })
      .finally(() => {
        loader.hide();
      });
  }, [ui, wallet]);

  return (
    <>
      <NavbarContextProvider setShowBurger={setShowBurger}>
        <Outlet />
      </NavbarContextProvider>
      <Navbar withBurger={showBurger} />
    </>
  );
};
