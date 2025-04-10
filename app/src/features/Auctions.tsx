import React from "react";
import { useUserAccount } from "../contexts/account";
import { Link } from "react-router";
import { AuctionRow } from "./AuctionRow";
import { useTonPriceOracle } from "../hooks/priceOracle";

export const Auctions: React.FC<{}> = () => {
  const { account } = useUserAccount();
  const tonUsdPair = Number(useTonPriceOracle()) / 1000000000;

  const auctions = account!.data.auctions.values();

  if (auctions.length == 0) {
    return (
      <div className="mx-auto text-gray-100">
        <div className="flex flex-none h-20 justify-center"></div>

        <div className="flex flex-col bg-base-100 rounded-box h-50 items-center mx-auto ml-5 mr-5">
          <h1 className="p-5">No auctions, yet.</h1>
          <Link to="/app/account/create">
            <button className="btn btn-primary">Create auction</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-dvh min-w-xs snap-y snap-proximity mx-auto text-gray-100 overflow-y-auto pb-10">
      <div className="flex flex-none h-25 justify-center"></div>

      <ul className="mx-auto list bg-base-100 rounded-box shadow-md w-80">
        <li>
          <h1 className="p-4 mx-auto">My auctions</h1>
        </li>

        <div className="divider p-0 m-0 h-0"></div>

        {account &&
          auctions.map((auc) => {
            return (
              <AuctionRow
                key={auc.id}
                auction={auc}
                tonUsdPrice={tonUsdPair}
                account={account}
              />
            );
          })}
      </ul>
    </div>
  );
};
