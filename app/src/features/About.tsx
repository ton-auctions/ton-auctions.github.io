import React from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

export function About() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    if (!params.get("fwd")) return;
    navigate(`${params.get("fwd")}`);
  }, [params]);

  return (
    <div className="max-h-dvh min-w-xs flex h-full flex-col overflow-y-auto">
      <div className="navbar absolute bg-base-300 shadow-sm max-h-dvh min-w-xs z-10">
        <div className="flex-1 text-xl pl-2">BidTon (Alpha-Testnet)</div>
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
