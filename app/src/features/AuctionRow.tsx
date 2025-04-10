import moment from "moment";
import { AuctionConfig } from "../protocol/tact_Account";
import React from "react";
import { useTonPriceOracle } from "../hooks/priceOracle";

type AuctionRowProps = {
  auction: AuctionConfig;
};

export const AuctionRow: React.FC<AuctionRowProps> = ({ auction }) => {
  const tonUsdPair = Number(useTonPriceOracle()) / 1000000000;

  const now = moment();

  const secondsDiff = Number(auction.ends_at) - now.unix();
  const duration = moment.duration(secondsDiff, "seconds");

  const daysTillEnd = Math.floor(duration.asDays());
  const hoursTillEnd = Math.floor(duration.asHours() % 24);
  const minutesTillEnd = Math.floor(duration.asMinutes() % 60);

  const tillEndString =
    daysTillEnd > 0
      ? `${daysTillEnd}d ${hoursTillEnd}h left`
      : `${hoursTillEnd}h ${minutesTillEnd}m left`;

  const minimal_amount = Number(auction.minimal_amount) / 1000000000;

  return (
    <li className="list-row flex-row">
      <div className="flex">
        <div className="flex-col flex-grow">Slot: {auction.name}</div>

        {!auction.ended && secondsDiff > 0 ? (
          <div className="flex-col text-green-300">
            <b>{tillEndString}</b>
          </div>
        ) : (
          <div className="flex-col text-red-300">
            <b>Ended</b>
          </div>
        )}
      </div>
      <div className="list-col-wrap text-xs">
        <div className="">{auction.description}</div>
        <div className="mt-3">
          <b>Minimal Bid:</b> {minimal_amount.toFixed(1)} TON (
          {(minimal_amount / tonUsdPair!).toFixed(1)} USD)
        </div>
        <div className="flex flex-row p-0 mt-3 justify-items-end">
          <button className="btn bg-primary">Collect money</button>
          <button className="btn bg-secondary">Stop</button>
          <button className="btn">Message</button>
        </div>
      </div>
    </li>
  );
};
