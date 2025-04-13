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
}

export const AccountContext = createContext<AccountValue>({
  refreshAccount: () => {
    throw new Error("refreshAccount function must be overridden");
  },
});

type AccountContextProviderProps = React.PropsWithChildren & {
  account?: Account;
  refreshAccount: () => void;
};

export const AccountContextProvider: React.FC<AccountContextProviderProps> = ({
  children,
  account,
  refreshAccount,
}) => {
  return (
    <AccountContext.Provider
      value={{
        account,
        refreshAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useUserAccount = () => useContext(AccountContext);
