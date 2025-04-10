import { useState } from "react";
import { useLoader } from "../contexts/loader";
import { useTon } from "../contexts/tonClient";
import { useConnection } from "../hooks/ton";
import { Moment } from "moment";
import moment from "moment";
import { DeployedAccount } from "../contexts/account";
import { OpenedContract, toNano } from "@ton/core";
import { WalletV5 } from "../protocol/wallet_v5";
import { useCallback } from "react";
import React from "react";
import { useTonPriceOracle } from "../hooks/priceOracle";

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
  const ton = useTon();
  const connection = useConnection();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [minimalAmountString, setMinimalAmountString] = useState<string>("1");
  const [endsAt, setEndsAt] = useState<Moment>(moment().add(2, "days"));

  const createAuction = useCallback(async () => {
    if (!account.deployed) return;
    if (!wallet) return;

    loader.show("Creating Auction. Signing transaction.");

    const tx = await ton.waitForTransactions({
      at_address: account.contract.address,
      after_ts: moment(0),
      limit: 1,
      timeout: 1000,
    });

    await account.contract.send(
      connection.sender,
      {
        value: toNano("0.1"),
        bounce: true,
      },
      {
        $$type: "CreateBasicAuction",
        id: BigInt(Math.ceil(Math.random() * 1000)),
        name: name,
        description: description,
        ends_at: BigInt(Math.ceil(endsAt.unix())),
        minimal_amount: toNano(minimalAmountString),
      }
    );

    await ton.waitForTransactions({
      at_address: account.contract.address,
      after_ts: moment(tx[0].now),
      lt: tx[0].lt.toString(),
      hash: tx[0].hash().toString("base64"),
      src: wallet.address,
      dest: account.contract.address,
      timeout: 10000,
    });

    // TODO: notify operation complete;
    resetForm();
    onAccountChange();
    loader.hide();
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 56 56"
                fill="none"
              >
                <script
                  id="argent-x-extension"
                  data-extension-id="dlcobpjiigpikoobohmabehhmhfoodbb"
                />
                <path
                  d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
                  fill="#0098EA"
                />
                <path
                  d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z"
                  fill="white"
                />
              </svg>
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
            setEndsAt(moment(event.target.value, "DD/MM/YYYY"));
          }}
        />

        <button className="btn btn-neutral mt-4" type="submit">
          Create
        </button>
      </fieldset>
    </form>
  );
};
