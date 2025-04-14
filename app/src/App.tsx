import { TonConnectUIProvider } from "@tonconnect/ui-react";

import { ConnectWallet } from "./features/ConnectWallet";

import React from "react";

import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from "react-router";
import { BaseLayout } from "./layouts/BaseLayout";
import { RegistrationPage } from "./features/RegistrationPage";
import { CreateAuction } from "./features/CreateAuction";
import { AccountZone } from "./layouts/AccountZone";
import { WalletZone } from "./layouts/WalletZone";

import { Profile } from "./features/Profile";
import { Auctions } from "./features/Auctions";
import { AuctionPublic } from "./features/AuctionPublic";
import { useEffect } from "react";

const CONTROLLER_ADDRESS = "EQAoBwzUQDvHl8nak23mTMtiqGDWbbmh0alvu0Kc39OgXF9I";

function About() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params.get("fwd")) return;
    navigate(`${params.get("fwd")}`);
  }, [params]);

  return (
    <div className="max-h-dvh min-w-xs flex h-full flex-col overflow-y-auto">
      <div className="navbar absolute bg-base-300 shadow-sm max-h-dvh min-w-xs z-10">
        <div className="flex-1 text-xl pl-2">BidTon</div>
      </div>

      <div className=" min-w-xs mx-auto text-gray-100 w-min-xs w-max-md pb-10">
        <div className="flex flex-none h-25 justify-center"></div>

        <div className="bg-base-100 rounded-lg">
          <div className="hero ">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">Welcome to BidTon</h1>
                <p className="py-6 text-pretty">
                  BidTon is a miniapp and on-chain protocol built for the TON
                  ecosystem. It lets you create auctions and share them directly
                  through Telegram channels—simple, fast, and decentralized.
                </p>
                <button
                  onClick={() => {
                    navigate("app");
                  }}
                  className="btn btn-primary"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>

          <ul className="list bg-base-100 rounded-box shadow-md max-w-md">
            <li className="p-4 text-center text-5xl pb-2 opacity-100 tracking-wide">
              Features
            </li>

            <li className="list-row px-10">
              <div className="text-5xl font-thin opacity-100 tabular-nums">
                •
              </div>
              <div className="list-col-grow">
                <div className="text-xl">Fully on-chain</div>
                <div className="text-l font-semibold opacity-60 text-pretty">
                  Every interaction happens right on the blockchain. No
                  middlemen, no off-chain tricks.
                </div>
              </div>
            </li>

            <li className="list-row px-10">
              <div className="text-5xl font-thin opacity-100 tabular-nums">
                •
              </div>
              <div className="list-col-grow">
                <div className="text-xl">Privacy-first</div>
                <div className="text-l font-semibold opacity-60 text-pretty">
                  Your Telegram handle stays private. All communication between
                  winners and auction creators runs securely through our
                  Telegram bot.
                </div>
              </div>
            </li>
            <li className="list-row px-10">
              <div className="text-5xl font-thin opacity-100 tabular-nums">
                •
              </div>
              <div className="list-col-grow">
                <div className="text-xl">Open-source</div>
                <div className="text-l font-semibold opacity-60 text-pretty">
                  The protocol is fully transparent. Dive into the code anytime
                  and see exactly how it works.
                </div>
              </div>
            </li>
            <li className="list-row px-10">
              <div className="text-5xl font-thin opacity-100 tabular-nums">
                •
              </div>
              <div className="list-col-grow ">
                <div className="text-xl">Immutable accounts</div>
                <div className="text-l font-semibold opacity-60 w-max-md text-pretty">
                  Once you create an account, it’s set in stone. Future versions
                  may need new accounts, but we’re committed to supporting
                  existing ones for life.
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
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
