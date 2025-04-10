import { TonConnectUIProvider } from "@tonconnect/ui-react";

import { ConnectWallet, useWalletContract } from "./features/ConnectWallet";
import { Address } from "@ton/core";

import React from "react";

import { Route, Routes } from "react-router";
import { BaseLayout } from "./layouts/BaseLayout";
import { Registration } from "./features/Registration";
import { useUserAccount } from "./contexts/account";
import { TonContextValue, useTon } from "./contexts/tonClient";
import { CreateAuctionForm } from "./features/CreateAuction";
import { AuctionRow } from "./features/AuctionRow";
import { AccountZone } from "./layouts/AccountZone";

const CONTROLLER_ADDRESS = "EQC9mlmtZxFa6-MHfpAFfztJXOwY-uCR406rXtqZv_OYOk3U";

const waitTillExists = async (client: TonContextValue, src: Address) => {
  let contractExists = true;
  while (contractExists) {
    contractExists = await client.client.isContractDeployed(src);
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
};

const Auctions: React.FC<{}> = () => {
  const { account, refreshAccount } = useUserAccount();
  const ton = useTon();
  const wallet = useWalletContract(ton);

  return (
    <div className="mx-auto text-gray-100">
      <ul className="mx-auto list bg-base-100 rounded-box shadow-md mt-5 w-80">
        <li>
          <h1 className="p-4 mx-auto">My auctions</h1>
        </li>

        <div className="divider p-0 m-0 h-0"></div>

        {account!.data.auctions.values().map((auc) => {
          return <AuctionRow key={auc.id} auction={auc} />;
        })}
      </ul>

      <CreateAuctionForm
        account={account!}
        wallet={wallet!}
        onAccountChange={refreshAccount}
      ></CreateAuctionForm>
    </div>
  );
};

function About() {
  return <div>OLOLOLO</div>;
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
          <Route path="register" element={<Registration />} />
          <Route path="auction/:address" element={<SKIP name="auction" />} />

          <Route path="app" element={<AccountZone />}>
            <Route index element={<Auctions />} />
            <Route path="auctions" element={<Auctions />} />
            <Route path="basic" element={<SKIP name="basic" />} />
            <Route path="profile" element={<SKIP name="profile" />} />
          </Route>
        </Route>
      </Routes>
    </TonConnectUIProvider>
  );
}

export default App;
