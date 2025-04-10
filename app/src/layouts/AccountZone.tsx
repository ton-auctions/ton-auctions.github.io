import { useTonWallet } from "@tonconnect/ui-react";
import { Navigate, Outlet, useLocation } from "react-router";
import {
  Account,
  AccountContextProvider,
  useUserAccount,
} from "../contexts/account";
import { Account as AccountWrapper, AccountData } from "../protocol";
import React, { useState } from "react";
import { useTon } from "../contexts/tonClient";
import { useLoader } from "../contexts/loader";
import { useServiceController } from "../contexts/serviceController";
import { useEffect } from "react";
import { Address } from "@ton/core";
import { useCallback } from "react";

const useAccountState = () => {
  const [refresher, setRefresher] = useState(0);

  const tonContext = useTon();
  const loader = useLoader();
  const wallet = useTonWallet();

  const controller = useServiceController();
  const [account, setAccount] = useState<Account>({
    deployed: false,
  });

  useEffect(() => {
    const walletAddressStr = wallet?.account.address;

    if (!walletAddressStr) return;
    if (!tonContext) return;
    if (!controller.loaded) return;

    const walletAddress = Address.parse(walletAddressStr);

    const loadServiceAccount = async () => {
      const accountAddress = await controller.contract.getUserAccount(
        walletAddress
      );

      const isDeployed = await tonContext.client.isContractDeployed(
        accountAddress
      );

      if (!isDeployed) {
        setAccount({
          deployed: false,
          address: accountAddress,
        });
        return;
      }

      const contract = tonContext.cachedOpenContract(
        AccountWrapper.fromAddress(accountAddress)
      );
      const data = await contract.getData();

      setAccount({
        address: accountAddress,
        deployed: true,
        contract: contract,
        data: data,
      });
    };

    loader.show("Locating user account.");
    loadServiceAccount().finally(loader.hide);
    // TODO: handle exceptions.
  }, [wallet, tonContext, controller, refresher]);

  const refreshAccount = useCallback(() => {
    setRefresher((refresher + 1) % 1000);
  }, [controller, wallet, account]);

  return {
    account,
    refreshAccount,
  };
};

export const AccountZone = () => {
  const wallet = useTonWallet();
  const location = useLocation();
  const { account, refreshAccount } = useAccountState();

  if (wallet === null) {
    return (
      <Navigate to="/connect" state={{ forward: location.pathname }} replace />
    );
  }

  if (!account.deployed) {
    return (
      <Navigate to="/register" state={{ forward: location.pathname }} replace />
    );
  }

  return (
    <AccountContextProvider account={account} refreshAccount={refreshAccount}>
      <Outlet />;
    </AccountContextProvider>
  );
};
