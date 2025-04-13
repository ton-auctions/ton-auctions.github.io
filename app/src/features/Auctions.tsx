import React, { useEffect, useState } from "react";
import { useUserAccount } from "../contexts/account";
import { Link } from "react-router";

import { AuctionConfig } from "../protocol";

import { useTonPriceOracle } from "../hooks/priceOracle";

import { AuctionRow } from "./AuctionRow";

export const Auctions: React.FC<unknown> = () => {
  const { account } = useUserAccount();
  const tonUsdPair = Number(useTonPriceOracle()) / 1000000000;
  const [auctions, setAuctions] = useState<AuctionConfig[]>([]);

  useEffect(() => {
    if (!account) return;

    setAuctions(account.data.auctions.values());
  }, [account]);

  if (auctions.length == 0) {
    return (
      <div className="max-h-dvh min-w-xs snap-y snap-proximity mx-auto text-gray-100 overflow-y-auto pb-10">
        <div className="flex flex-none h-25 justify-center"></div>

        <div className="flex flex-col bg-base-100 rounded-box w-xs items-center mx-auto p-5">
          <h1 className="pb-5">No auctions, yet.</h1>
          <Link to="/app/account/create">
            <button className="btn btn-primary">Create auction</button>
          </Link>
        </div>
      </div>
    );
  }

  if (!account) return <></>;

  return (
    <div className="max-h-dvh min-w-xs snap-y snap-proximity mx-auto text-gray-100 overflow-y-auto pb-10">
      <div className="flex flex-none h-25 justify-center"></div>

      <ul className="flex-col mx-auto bg-base-100 rounded-box shadow-md w-xs">
        <li className="flex join">
          <h1 className="p-4 text-nowrap align-baseline">
            My auctions ({account.data.max_allowance - account.data.allowance}/
            {account.data.max_allowance})
          </h1>
          <span className="grow"></span>
          <span className="mt-2 mr-2 text-nowrap align-baseline">
            <Link to="/app/account/create">
              <button className="btn btn-ghost btn-circle">+</button>
            </Link>
          </span>
        </li>

        <div className="divider p-0 m-0 h-0"></div>

        {account &&
          auctions.map((auc) => {
            return (
              <AuctionRow key={auc.id} auction={auc} tonUsdPrice={tonUsdPair} />
            );
          })}
      </ul>
    </div>
  );
};
