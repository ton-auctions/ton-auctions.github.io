import React, { useCallback } from "react";
import moment from "moment";

import { DeployedAccount } from "../contexts/account";
import { AuctionConfig, loadDelete } from "../protocol";
import { BasicAuction } from "../protocol/tact_BasicAuction";
import { useTon } from "../contexts/tonClient";
import { useConnection } from "../hooks/ton";
import { toNano } from "@ton/core";
import { useWalletContract } from "./ConnectWallet";

type AuctionRowProps = {
  account: DeployedAccount;
  auction: AuctionConfig;
  tonUsdPrice: number;
};

export const AuctionRow: React.FC<AuctionRowProps> = ({
  account,
  auction,
  tonUsdPrice,
}) => {
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

  const ton = useTon();
  const connection = useConnection();
  const wallet = useWalletContract(ton);

  const stopAuction = useCallback(async () => {
    const auctionContract = ton.cachedOpenContract(
      BasicAuction.fromAddress(auction.address)
    );

    const tx = await ton.waitForTransactions({
      at_address: auctionContract.address,
      after_ts: moment(0),
      limit: 1,
      timeout: 1000,
    });

    await auctionContract.send(
      connection.sender,
      {
        value: toNano("0"),
        bounce: true,
      },
      {
        $$type: "Delete",
      }
    );

    await ton.waitForTransactions2({
      at_address: auctionContract.address,
      from: wallet?.address!,
      after_ts: moment(tx[0].now),
      lt: tx[0].lt.toString(),
      hash: tx[0].hash().toString("base64"),
      testMessage: (cell) => {
        loadDelete(cell.asSlice());
        return true;
      },
    });
  }, []);

  return (
    <li className="list-row flex-row snap-center">
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
          {(minimal_amount / tonUsdPrice!).toFixed(1)} USD)
        </div>
        <div className="flex flex-row p-0 mt-3 justify-items-end">
          <button className="btn bg-primary">Collect money</button>
          <button className="btn bg-secondary" onClick={stopAuction}>
            Stop
          </button>
          <button className="btn">Message</button>
        </div>
      </div>
    </li>
  );
};
