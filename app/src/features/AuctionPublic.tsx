import moment from "moment";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Address, OpenedContract, toNano } from "@ton/core";

import { useUserAccount } from "../contexts/account";
import { useTon } from "../contexts/tonClient";
import { useLoader } from "../contexts/loader";
import { useAlerts } from "../contexts/alerts";

import { useConnection } from "../hooks/ton";
import { useTonPriceOracle } from "../hooks/priceOracle";

import { AuctionData, BasicAuction } from "../protocol/tact_BasicAuction";
import { loadBid } from "../protocol/tact_Account";

import { useWalletContract } from "./ConnectWallet";
import { RegisterButton } from "./RegisterButton";

import Ton from "../assets/ton.svg";

const useAuctionContract = (
  address?: string
): [OpenedContract<BasicAuction> | undefined, AuctionData | undefined] => {
  const loader = useLoader();
  const ton = useTon();

  const [auctionContract, setAuctionContract] = useState<
    OpenedContract<BasicAuction> | undefined
  >();
  const [auctionData, setContractData] = useState<AuctionData | undefined>();

  useEffect(() => {
    if (!address) return;

    const contract = ton.cachedOpenContract(
      BasicAuction.fromAddress(Address.parse(address))
    );

    setAuctionContract(contract);

    loader.show("Loading auction");

    contract
      .getData()
      .then((val) => {
        setContractData(val);
      })
      .catch(() => {
        // TODO: alert;
      })
      .finally(() => loader.hide());
  }, [address]);

  return [auctionContract, auctionData];
};

export const AuctionPublic: React.FC<unknown> = () => {
  const loader = useLoader();
  const alerts = useAlerts();

  const { address } = useParams();

  const { account, refreshAccount } = useUserAccount();
  const tonBidRef = useRef<HTMLInputElement>(null);
  const usdBidRef = useRef<HTMLInputElement>(null);
  const tonUsdPair = Number(useTonPriceOracle()) / 1000000000;
  const ton = useTon();
  const connection = useConnection();
  const wallet = useWalletContract(ton);

  const [minimalBid, setMinimalBid] = useState(0);

  const [auctionContract, auctionData] = useAuctionContract(address);

  useEffect(() => {
    if (!auctionData) return;
    const minimalRaise = Number(auctionData.minimal_raise) / 1000000000;
    const minimalAmount = Number(auctionData.minimal_amount) / 1000000000;

    setMinimalBid(minimalAmount + minimalRaise);
  }, [auctionData]);

  const placeBid = useCallback(() => {
    if (!connection) return;
    if (!wallet) return;
    if (!auctionContract) return;
    if (!tonBidRef.current) return;

    loader.show("Placing bid. Sending transaction.");

    ton
      .signSendAndWait({
        checkAddress: auctionContract.address,
        checkTransactionFrom: wallet.address,
        checkTimeout: 10000,
        send: async () => {
          await auctionContract.send(
            connection.sender,
            {
              value: toNano(tonBidRef.current!.value),
            },
            {
              $$type: "Bid",
              chat_id: 0n,
            }
          );
        },
        testMessage: (cell) => loadBid(cell.asSlice()),
        updateLoader: (text) => loader.show(`Placing bid. ${text}`),
      })
      .catch((e) => {
        alerts.addAlert("Error", `Can't bid. ${e}`, 5000);
      })
      .finally(() => loader.hide())
      .then(() => {
        refreshAccount();
      });
  }, [connection, wallet, auctionData, tonBidRef]);

  const setMin = useCallback(() => {
    if (!minimalBid) return;
    if (!tonBidRef.current) return;
    if (!usdBidRef.current) return;

    tonBidRef.current.value = minimalBid.toFixed(1);
    usdBidRef.current.value = (minimalBid / tonUsdPair).toFixed(1);
  }, [tonBidRef, usdBidRef, minimalBid]);

  const increaseNPercent = useCallback(
    (n: number) => {
      if (!tonUsdPair) return;
      if (!tonBidRef.current) return;
      if (!usdBidRef.current) return;

      const currentTonValue = Number.parseFloat(tonBidRef.current.value);

      const increment = 1 + n / 100;

      const newTonBid = currentTonValue * increment;
      const newUsdBid = newTonBid / tonUsdPair;

      tonBidRef.current.value = newTonBid.toFixed(1);
      usdBidRef.current.value = newUsdBid.toFixed(1);
    },
    [tonBidRef, usdBidRef, tonUsdPair]
  );

  const now = moment();

  if (!auctionData) return;

  // todo: move into hook. then to valtio state.
  const secondsDiff = Number(auctionData.ends_at) - now.unix();
  const duration = moment.duration(secondsDiff, "seconds");

  const daysTillEnd = Math.floor(duration.asDays());
  const hoursTillEnd = Math.floor(duration.asHours() % 24);
  const minutesTillEnd = Math.floor(duration.asMinutes() % 60);

  const tillEndString =
    daysTillEnd > 0
      ? `${daysTillEnd}d ${hoursTillEnd}h left`
      : `${hoursTillEnd}h ${minutesTillEnd}m left`;

  return (
    <div className="max-h-dvh min-w-xs snap-y snap-proximity mx-auto text-gray-100 overflow-y-auto pb-10">
      <div className="flex flex-none h-25 justify-center"></div>

      <ul className="flex-col mx-auto bg-base-100 rounded-box shadow-md w-xs">
        <li className="snap-center p-4">
          <div className="flex">
            <div className="flex-col flex-grow">Slot: {auctionData.name}</div>

            {!auctionData.ended && secondsDiff > 0 ? (
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
              {auctionData.description}
            </div>

            <div className="mt-3" onClick={() => refreshAccount()}>
              <b>Minimal Bid:</b> {minimalBid.toFixed(1)} TON (
              {(minimalBid / tonUsdPair).toFixed(1)} USD)
            </div>

            <div className="join mt-4">
              <label className="input focus:outline-none">
                <input
                  ref={tonBidRef}
                  type="number"
                  className="input validator focus:outline-none"
                  required
                  placeholder="TON"
                  readOnly={true}
                  min="1"
                  value={minimalBid.toFixed(1)}
                  title="Must be between be 1 to 10"
                />
                <span className="label">
                  <Ton />
                </span>
              </label>
              <label className="input focus:outline-none">
                <input
                  ref={usdBidRef}
                  type="number"
                  className="input validator focus:outline-none"
                  required
                  readOnly={true}
                  value={(minimalBid / tonUsdPair).toFixed(1)}
                  placeholder="USD"
                  min="0"
                  title="Must be between be 1 to 10"
                />
                <span className="label">$</span>
              </label>
            </div>
            <div
              hidden={
                !auctionData.winner ||
                auctionData.winner.toString() != wallet?.address.toString()
              }
              className="flex pt-5"
            >
              Your bid is winning. But... who cares, right?
            </div>

            <div
              hidden={
                auctionData.owner_account.toString() !=
                wallet?.address.toString()
              }
              className="flex"
            >
              This is your own auction. Remember?
            </div>

            <div className="join flex pt-5 pb-2">
              <button onClick={setMin} className="btn btn-accent grow mr-1">
                Min
              </button>
              <button
                onClick={() => increaseNPercent(10)}
                className="btn btn-primary grow mx-1"
              >
                10%
              </button>
              <button
                onClick={() => increaseNPercent(50)}
                className="btn btn-primary grow mx-1"
              >
                50%
              </button>
              <button
                onClick={() => increaseNPercent(100)}
                className="btn btn-primary grow ml-1"
              >
                100%
              </button>
            </div>

            <div
              hidden={auctionData.ended}
              className="flex flex-row p-0 mt-0 join"
            >
              <div className="grow"></div>
            </div>

            <div
              hidden={auctionData.ended}
              className="flex flex-row p-0 mt-0 place-items-end"
            >
              <button className="btn bg-primary grow" onClick={placeBid}>
                Place Bid
              </button>
            </div>

            {!account?.deployed && (
              <>
                <div className="divider"></div>

                <p>
                  We noticed that you don't have an account. Fancy to make one?
                </p>

                <div
                  hidden={auctionData.ended}
                  className="flex flex-row p-0 mt-5 place-items-end"
                >
                  <RegisterButton
                    referree={auctionData.owner_account}
                  ></RegisterButton>
                </div>
              </>
            )}
            {/* <div
              className="btn w-full"
              onClick={() => {
                console.log("WOW");
                alerts.addAlert("title", "hahaha", 4000);
              }}
            >
              TEST
            </div> */}
          </div>
        </li>
      </ul>
    </div>
  );
};
