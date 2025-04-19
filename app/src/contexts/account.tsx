import React from "react";

import { Address, OpenedContract } from "@ton/core";
import { createContext } from "react";
import { useContext } from "react";
import { Account as AccountWrapper, AccountData } from "../protocol";

export interface DeployedAccount {
  address: Address;
  deployed: true;
  contract: OpenedContract<AccountWrapper>;
  data: AccountData;
}

export interface UndeployedAccount {
  address?: Address;
  deployed: false;
}

export type Account = DeployedAccount | UndeployedAccount;

interface AccountValue {
  account?: Account;
  refreshAccount: () => void;
  dropAccount: () => void;
}

export const AccountContext = createContext<AccountValue>({
  refreshAccount: () => {
    throw new Error("refreshAccount function must be overridden");
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dropAccount: () => {},
});

type AccountContextProviderProps = React.PropsWithChildren & {
  account?: Account;
  refreshAccount: () => void;
  dropAccount: () => void;
};

export const AccountContextProvider: React.FC<AccountContextProviderProps> = ({
  children,
  account,
  refreshAccount,
  dropAccount,
}) => {
  return (
    <AccountContext.Provider
      value={{
        account,
        refreshAccount,
        dropAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => useContext(AccountContext);
