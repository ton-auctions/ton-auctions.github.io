import React from "react";
import axios from "axios";
import moment from "moment";

import { useCallback, useEffect, useRef, useState } from "react";
import { useUserAccount } from "../contexts/account";
import { useTon } from "../contexts/tonClient";
import { useWalletContract } from "./ConnectWallet";
import { DeleteAccount } from "./DeleteAccount";
import { useAlerts } from "../contexts/alerts";

import Copy from "../assets/copy.svg";

const PAGA = "https://ton-auctions.github.io";

const shortenUrl = async (referral: string) => {
  try {
    const response = await axios({
      method: "get",
      url: `https://is.gd/create.php`,
      params: {
        url: `${PAGA}/r/${referral}`,
        format: "simple",
      },
    });
    return response.data;
  } catch (err) {
    return `${PAGA}/r/${referral}`;
  }
};

export const Profile: React.FC<{}> = () => {
  const { account, refreshAccount } = useUserAccount();
  const ref = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(null);
  const ton = useTon();
  const wallet = useWalletContract(ton);
  const alerts = useAlerts();

  useEffect(() => {
    if (!account) return;

    shortenUrl(account.address.toString()).then((data) => {
      setUrl(data);
    });
  }, [account]);

  const copyCall = useCallback(async () => {
    if (ref.current == null) return;

    await navigator.clipboard.writeText(ref.current.value);

    alerts.addAlert("Copied!", 10000);
  }, [ref]);

  return (
    <div className="max-h-dvh min-w-xs mx-auto text-gray-100 w-xs">
      <div className="flex flex-none h-25 justify-center"></div>

      <div className="flex flex-col mx-auto list bg-base-100 rounded-box shadow-md w-80">
        <h1 className="p-4 mx-auto">Profile</h1>

        <div className="divider p-0 m-0 h-0"></div>

        <div className="join pt-5 pl-5 pr-5">
          <label className="floating-label w-full">
            <input
              ref={ref}
              type="text"
              readOnly={true}
              value={url || ""}
              className="input"
            />
            <span>Referral link</span>
          </label>

          <button className="btn btn-primary w-10 p-0" onClick={copyCall}>
            <Copy width={25} height={25} />
          </button>
        </div>

        <div className="flex">
          <DeleteAccount
            account={account!}
            refreshAccount={refreshAccount}
            wallet={wallet!}
          />
        </div>
      </div>
    </div>
  );
};
