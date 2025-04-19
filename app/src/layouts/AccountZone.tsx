import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import { useTonContext } from "../contexts/tonClient";
import {
  Account,
  UndeployedAccount,
  AccountContextProvider,
  DeployedAccount,
} from "../contexts/account";
import { useLoaderContext } from "../contexts/loader";
import { useServiceControllerContext } from "../contexts/serviceController";
import { useNavbarContext } from "../contexts/navbar";

import { Drawer } from "../features/Drawer";
import { getAccountWrapper } from "../utils/addresses";
import { wrapWithRetry } from "../utils/wrappers";
import { useWalletContext } from "../contexts/wallet";

// TODO: Rewrite like WalletZone
const useAccountState = () => {
  const [refresher, setRefresher] = useState(0);

  const ton = useTonContext();
  const loader = useLoaderContext();
  const wallet = useWalletContext();

  const controller = useServiceControllerContext();
  const [account, setAccount] = useState<Account | undefined>();

  useEffect(() => {
    if (!ton) return;
    if (!controller.loaded) return;
    if (!wallet.connected) return;

    const loadServiceAccount = async () => {
      const accountWrapper = await getAccountWrapper(
        controller.contract,
        wallet.address
      );

      // TODO: handle errors
      const isDeployed = await wrapWithRetry<boolean>(() =>
        ton.client.isContractDeployed(accountWrapper.address)
      );

      if (!isDeployed) {
        setAccount({
          deployed: false,
          address: accountWrapper.address,
        } as UndeployedAccount);
        return;
      }

      const contract = ton.cachedOpenContract(accountWrapper);

      // TODO: retry wrapper
      const data = await contract.getData();

      setAccount({
        address: accountWrapper.address,
        deployed: true,
        contract: contract,
        data: data,
      } as DeployedAccount);
    };

    loader.show("Locating user account.");
    loadServiceAccount().finally(loader.hide);
    // TODO: handle exceptions.
  }, [ton, wallet, controller, refresher]);

  const refreshAccount = useCallback(() => {
    setRefresher((refresher + 1) % 1000);
  }, [controller, wallet, account]);

  const dropAccount = useCallback(() => {
    setAccount(undefined);
  }, [account]);

  return {
    account,
    refreshAccount,
    dropAccount,
  };
};

export const AccountZone = () => {
  const loader = useLoaderContext();
  const location = useLocation();
  const navigate = useNavigate();

  const navBarControls = useNavbarContext();
  const { account, refreshAccount, dropAccount } = useAccountState();
  // TODO: move into context
  useEffect(() => {
    loader.show("Fetching account");

    navBarControls.setShowBurger(false);

    if (!account) return;

    if (!account.deployed) {
      loader.hide();
      navigate("/app/register", {
        state: {
          forward: location.pathname,
        },
      });
    } else {
      navBarControls.setShowBurger(true);
      loader.hide();
    }
  }, [account]);

  return (
    <AccountContextProvider
      account={account}
      refreshAccount={refreshAccount}
      dropAccount={dropAccount}
    >
      <Drawer>
        <Outlet />
      </Drawer>
    </AccountContextProvider>
  );
};
