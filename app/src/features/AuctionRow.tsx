import React, { useCallback } from "react";
import moment from "moment";
import { toNano } from "@ton/core";

import { useAccountContext } from "../contexts/account";
import { useTonContext } from "../contexts/tonClient";
import { useLoaderContext } from "../contexts/loader";
import { useAlertsContext } from "../contexts/alerts";

import { useConnection } from "../hooks/ton";

import { AuctionConfig, loadDelete } from "../protocol";
import { BasicAuction } from "../protocol/tact_BasicAuction";

import { useWalletContract } from "./ConnectWallet";

import Copy from "../assets/copy.svg";

interface AuctionRowProps {
  auction: AuctionConfig;
  tonUsdPrice: number;
}

export const AuctionRow: React.FC<AuctionRowProps> = ({
  auction,
  tonUsdPrice,
}) => {
  const loader = useLoaderContext();
  const alerts = useAlertsContext();

  const now = moment();

  const secondsDiff = Number(auction.ends_at) - now.unix();
  const duration = moment.duration(secondsDiff, "seconds");
  const { refreshAccount } = useAccountContext();

  const daysTillEnd = Math.floor(duration.asDays());
  const hoursTillEnd = Math.floor(duration.asHours() % 24);
  const minutesTillEnd = Math.floor(duration.asMinutes() % 60);

  const tillEndString =
    daysTillEnd > 0
      ? `${daysTillEnd}d ${hoursTillEnd}h left`
      : `${hoursTillEnd}h ${minutesTillEnd}m left`;

  const minimal_amount = Number(auction.minimal_amount) / 1000000000;

  const ton = useTonContext();
  const connection = useConnection();
  const wallet = useWalletContract(ton);

  const stopAuction = useCallback(async () => {
    if (!wallet) return;

    loader.show("Stopping auction.");

    const auctionContract = ton.cachedOpenContract(
      BasicAuction.fromAddress(auction.address)
    );

    ton
      .signSendAndWait({
        checkAddress: auctionContract.address,
        checkTransactionFrom: wallet.address,
        send: async () => {
          await auctionContract.send(
            connection.sender,
            {
              value: toNano("0.05"),
              bounce: true,
            },
            {
              $$type: "Delete",
            }
          );
        },
        updateLoader: (text) => loader.show(`Stopping auction. ${text}`),
        testMessage: (cell) => loadDelete(cell.asSlice()),
      })
      .catch((e) => {
        alerts.addAlert("Error", `Something went wrong. ${e}.`, 5000);
      })
      .finally(() => {
        loader.hide();
        refreshAccount();
      });
  }, []);

  return (
    <li className="snap-center p-4">
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
        <div className="mt-3 text-pretty overflow-hidden">
          {auction.description}
        </div>
        <div className="mt-3" onClick={() => refreshAccount()}>
          <b>Minimal Bid:</b> {minimal_amount.toFixed(1)} TON (
          {(minimal_amount / tonUsdPrice).toFixed(1)} USD)
        </div>
        <div
          hidden={auction.ended}
          className="flex flex-row p-0 mt-3 place-items-end"
        >
          <div className="grow"></div>
          <button
            hidden={auction.ended || secondsDiff > 0}
            className="btn bg-primary"
          >
            Collect money
          </button>
          <button className="btn bg-secondary" onClick={stopAuction}>
            Stop
          </button>
          {/* <button className="btn bg-gray-600">Open</button> */}
          <button
            className="btn bg-gray-600"
            onClick={() => {
              const origin = window.location.origin;
              navigator.clipboard.writeText(
                `${origin}/auction/${auction.address}`
              );
            }}
          >
            <Copy width="20" height="20"></Copy>
          </button>
        </div>
      </div>
    </li>
  );
};
