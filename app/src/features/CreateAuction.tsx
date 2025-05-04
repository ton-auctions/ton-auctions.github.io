import moment, { Moment } from "moment";
import React from "react";

import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { OpenedContract, toNano } from "@ton/core";

import { useLoaderContext } from "../contexts/loader";
import { useTonContext } from "../contexts/tonClient";
import { DeployedAccount, useAccountContext } from "../contexts/account";
import { useAlertsContext } from "../contexts/alerts";

import { useWalletContract } from "./ConnectWallet";
import { useConnection } from "../hooks/ton";
import { useTonPriceOracle } from "../hooks/priceOracle";
import { useServiceControllerContext } from "../contexts/serviceController";

import { WalletV5 } from "../protocol/wallet_v5";
import { BasicAuction } from "../protocol";

import Ton from "../assets/ton.svg";

interface CreateAuctionFormProps {
  account: DeployedAccount;
  wallet: OpenedContract<WalletV5>;
  onAccountChange: () => void;
}

export const CreateAuctionForm: React.FC<CreateAuctionFormProps> = ({
  account,
  wallet,
  onAccountChange,
}) => {
  const loader = useLoaderContext();
  const alerts = useAlertsContext();
  const ton = useTonContext();
  const connection = useConnection();
  const controller = useServiceControllerContext();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [minimalAmountString, setMinimalAmountString] = useState<string>("1");
  const [endsAt, setEndsAt] = useState<Moment>(moment().add(2, "days"));

  const createAuction = useCallback(async () => {
    if (!account.deployed) return;
    if (!wallet) return;
    if (!controller.loaded) return;

    const ends_at = BigInt(Math.ceil(endsAt.unix()));
    const minimal_amount = toNano(minimalAmountString);
    const id = BigInt(Math.ceil(Math.random() * 1000));
    const secret_id = account.data.secret_id;

    const auctionContract = await BasicAuction.fromInit({
      $$type: "BasicAuctionData",
      id: id,
      name: name,
      description: description,
      balance: null,
      collector: controller.contract.address,
      ended: false,
      ends_at: ends_at,
      minimal_amount: minimal_amount,
      minimal_raise: 0n,
      owner: wallet.address,
      owner_account: account.address,
      owner_secret_id: secret_id,
      refund: false,
      type: "basic",
      winner: null,
    });

    ton
      .signSendAndWait({
        checkAddress: auctionContract.address,
        checkTransactionFrom: account.address,
        send: async () => {
          await account.contract.send(
            connection.sender,
            {
              value: toNano("0.1"),
              bounce: true,
            },
            {
              $$type: "CreateBasicAuction",
              id: id,
              name: name,
              description: description,
              ends_at: ends_at,
              minimal_amount: minimal_amount,
              secret_id: secret_id,
            }
          );
        },
        updateLoader: (text) => loader.show(`Creating Auction. ${text}`),
        testMessage: () => true,
      })
      .catch((e) => {
        alerts.addAlert("Error", `Something went wrong. ${e}.`, 5000);
      })
      .finally(() => {
        loader.hide();
      })
      .then(() => {
        resetForm();
        onAccountChange();
        navigate("/app/account/auctions");
        // TODO: notify complete
      });
  }, [account, wallet, name, description, minimalAmountString, endsAt]);

  const resetForm = useCallback(() => {
    setName("");
    setDescription("");
    setEndsAt(moment().add(2, "days"));
    setMinimalAmountString("1");
  }, []);

  const tonUsdPair = useTonPriceOracle();

  const conversionRate = tonUsdPair / 100000000;
  const minimalAmountValue = Number.parseFloat(minimalAmountString);

  const usdValue = minimalAmountValue * conversionRate;
  const usdString = usdValue.toFixed(1);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createAuction();
      }}
    >
      <fieldset className="fieldset mx-auto w-xs bg-base-100 border border-base-300 p-4 rounded-box">
        <legend className="fieldset-legend">Create auction</legend>

        <label className="fieldset-label">Title</label>
        <input
          type="text"
          className="input validator"
          required
          placeholder="Timeslot for 23.04.2025 15:00"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />

        <label className="fieldset-label">Description</label>
        <textarea
          className="textarea validator"
          required
          placeholder="Bio"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        ></textarea>

        <label className="fieldset-label">Minimal Amount</label>

        <div className="join">
          <label className="input focus:outline-none">
            <input
              type="number"
              className="input validator focus:outline-none"
              required
              placeholder="TON"
              readOnly={true}
              min="1"
              value={minimalAmountString}
              title="Must be between be 1 to 10"
            />
            <span className="label">
              <Ton />
            </span>
          </label>
          <label className="input focus:outline-none">
            <input
              type="number"
              className="input validator focus:outline-none"
              required
              readOnly={true}
              value={usdString}
              placeholder="USD"
              min="0"
              title="Must be between be 1 to 10"
            />
            <span className="label">$</span>
          </label>
        </div>

        <input
          type="range"
          min="1"
          max="1000"
          value={minimalAmountValue * 10}
          className="range join-item"
          onChange={(event) => {
            setMinimalAmountString(
              (Number.parseFloat(event.target.value) / 10).toFixed(1)
            );
          }}
        />

        <label className="fieldset-label">Ends At</label>
        <input
          type="date"
          className="input validator"
          required
          placeholder="20.04.2025"
          value={endsAt.format("YYYY-MM-DD")}
          min={moment().add(1, "day").format("YYYY-MM-DD")}
          max={moment().add(29, "days").format("YYYY-MM-DD")}
          onChange={(event) => {
            setEndsAt(moment(event.target.value, "YYYY-MM-DD"));
          }}
        />

        <button className="btn btn-neutral mt-4" type="submit">
          Create
        </button>
      </fieldset>
    </form>
  );
};

export const CreateAuction: React.FC<unknown> = () => {
  const { account, refreshAccount } = useAccountContext();
  const ton = useTonContext();
  const wallet = useWalletContract(ton);

  if (!account?.deployed) return <></>;
  if (!wallet) return <></>;

  return (
    <div className="max-h-dvh min-w-xs mx-auto text-gray-100">
      <div className="flex flex-none h-21 justify-center"></div>
      <CreateAuctionForm
        account={account}
        wallet={wallet}
        onAccountChange={refreshAccount}
      ></CreateAuctionForm>
    </div>
  );
};
