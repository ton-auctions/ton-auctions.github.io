import { TonConnectUIProvider } from "@tonconnect/ui-react";

import { ConnectWallet } from "./features/ConnectWallet";

import React from "react";

import { Navigate, Route, Routes, useNavigate } from "react-router";
import { BaseLayout } from "./layouts/BaseLayout";
import { RegistrationPage } from "./features/RegistrationPage";
import { CreateAuction } from "./features/CreateAuction";
import { AccountZone } from "./layouts/AccountZone";
import { WalletZone } from "./layouts/WalletZone";

import { Profile } from "./features/Profile";
import { Auctions } from "./features/Auctions";
import { AuctionPublic } from "./features/AuctionPublic";

const CONTROLLER_ADDRESS = "EQC-FtV545kd5EweOfG7FReI5KEYR8eC-yT3zzeyz2iTcOD0";

function About() {
  const navigate = useNavigate();

  return (
    <div>
      OLOLOLO
      <button
        className="btn btn-primary"
        onClick={() => {
          navigate("app");
        }}
      >
        TO APP
      </button>
    </div>
  );
}

function SKIP(props: { name: string }) {
  return <div>SKIP {props.name}</div>;
}

function App() {
  return (
    <TonConnectUIProvider
      manifestUrl={"https://ton-auctions.github.io/ton-connect-manifest.json"}
    >
      <Routes>
        <Route
          element={
            <BaseLayout
              controllerAddress={CONTROLLER_ADDRESS}
              apiKey="6f70772f00d62c4d3cc75f0037b6344a916901d447672b98f7267f25ad2e7b8b"
            />
          }
        >
          <Route index element={<About />} />
          <Route path="connect" element={<ConnectWallet />} />
          <Route path="auction/:address" element={<SKIP name="auction" />} />

          <Route path="r" element={<WalletZone />}>
            <Route path=":ref" element={<RegistrationPage />} />
          </Route>

          <Route path="app" element={<WalletZone />}>
            <Route index element={<Navigate to="account" />} />

            <Route path="register" element={<RegistrationPage />} />
            <Route path="auction/:address" element={<AuctionPublic />} />

            <Route path="account" element={<AccountZone />}>
              <Route index element={<Auctions />} />
              <Route path="auctions" element={<Auctions />} />
              <Route path="create" element={<CreateAuction />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </TonConnectUIProvider>
  );
}

export default App;
