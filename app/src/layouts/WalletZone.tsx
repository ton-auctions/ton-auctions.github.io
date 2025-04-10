import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useLoader } from "../contexts/loader";
import { Navbar } from "../features/Navbar";

export const WalletZone = () => {
  const [ui] = useTonConnectUI();
  const wallet = useTonWallet();
  const loader = useLoader();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loader.show("Checking wallet connection");
    console.log("WalletZone useEffect");
    ui.connectionRestored
      .then(() => {
        if (!wallet) {
          navigate("/connect", { state: { forward: location.pathname } });
        }
      })
      .finally(() => {
        loader.hide();
      });
  }, [ui]);

  if (!wallet) {
    return <></>;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
