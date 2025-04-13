import moment, { Moment } from "moment";
import React from "react";

import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { OpenedContract, toNano } from "@ton/core";

import { useLoader } from "../contexts/loader";
import { useTon } from "../contexts/tonClient";
import { DeployedAccount, useUserAccount } from "../contexts/account";
import { useAlerts } from "../contexts/alerts";

import { useWalletContract } from "./ConnectWallet";
import { useConnection } from "../hooks/ton";
import { useTonPriceOracle } from "../hooks/priceOracle";
import { useServiceController } from "../contexts/serviceController";

import { WalletV5 } from "../protocol/wallet_v5";
import { BasicAuction } from "../protocol";

import Ton from "../assets/ton.svg";

type CreateAuctionFormProps = {
  account: DeployedAccount;
  wallet: OpenedContract<WalletV5>;
  onAccountChange: () => void;
};

export const CreateAuctionForm: React.FC<CreateAuctionFormProps> = ({
  account,
  wallet,
  onAccountChange,
}) => {
  const loader = useLoader();
  const alerts = useAlerts();
  const ton = useTon();
  const connection = useConnection();
  const controller = useServiceController();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [minimalAmountString, setMinimalAmountString] = useState<string>("1");
  const [endsAt, setEndsAt] = useState<Moment>(moment().add(2, "days"));

  const createAuction = useCallback(async () => {
    if (!account.deployed) return;
    if (!wallet) return;
    if (!controller.loaded) return;

    const id = BigInt(Math.ceil(Math.random() * 1000));
    const ends_at = BigInt(Math.ceil(endsAt.unix()));
    const minimal_amount = toNano(minimalAmountString);

    const auctionContract = await BasicAuction.fromInit(
      id,
      name,
      description,
      wallet!.address,
      account.address,
      controller.contract.address,
      minimal_amount,
      ends_at,
      account.data.chat_id,
      null,
      false,
      false
    );

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
            }
          );
        },
        updateLoader: (text) => loader.show(`Creating Auction. ${text}`),
        testMessage: (cell) => true,
      })
      .catch((e) => {
        alerts.addAlert(`Something went wrong. ${e}.`, 5000);
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

  if (!tonUsdPair) {
    loader.show("Loading TON prices.");
    return <></>;
  }

  const conversionRate = tonUsdPair / 100000000;
  const minimalAmountValue = Number.parseFloat(minimalAmountString);

  const usdValue = minimalAmountValue * conversionRate;
  const usdString = usdValue.toFixed(1);

  loader.hide();

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

export const CreateAuction: React.FC<{}> = () => {
  const { account, refreshAccount } = useUserAccount();
  const ton = useTon();
  const wallet = useWalletContract(ton);

  return (
    <div className="max-h-dvh min-w-xs mx-auto text-gray-100">
      <div className="flex flex-none h-21 justify-center"></div>
      <CreateAuctionForm
        account={account!}
        wallet={wallet!}
        onAccountChange={refreshAccount}
      ></CreateAuctionForm>
    </div>
  );
};
