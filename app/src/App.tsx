import { TonConnectUIProvider } from "@tonconnect/ui-react";

import { ConnectWallet } from "./features/ConnectWallet";

import React from "react";

import { Navigate, Route, Routes } from "react-router";
import { BaseLayout } from "./layouts/BaseLayout";
import { RegistrationPage } from "./features/RegistrationPage";
import { CreateAuction } from "./features/CreateAuction";
import { AccountZone } from "./layouts/AccountZone";
import { WalletZone } from "./layouts/WalletZone";

import { Profile } from "./features/Profile";
import { Auctions } from "./features/Auctions";
import { AuctionPublic } from "./features/AuctionPublic";
import { About } from "./features/About";
import { config } from "./config";

function App() {
  return (
    <TonConnectUIProvider
      manifestUrl={"https://ton-auctions.github.io/ton-connect-manifest.json"}
    >
      <Routes>
        <Route
          element={
            <BaseLayout
              controllerAddress={config.controller}
              apiKey={config.toncenterKey}
            />
          }
        >
          <Route index element={<About />} />

          <Route path="connect" element={<WalletZone noRedirect />}>
            <Route index element={<ConnectWallet />} />
          </Route>

          <Route path="r" element={<WalletZone />}>
            <Route path=":ref" element={<RegistrationPage />} />
          </Route>

          <Route path="auction" element={<WalletZone />}>
            <Route path=":address" element={<AuctionPublic />} />
          </Route>

          <Route path="app" element={<WalletZone />}>
            <Route index element={<Navigate to="account" />} />

            <Route path="register" element={<RegistrationPage />} />

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
