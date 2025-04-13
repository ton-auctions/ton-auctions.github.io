import { useTonWallet } from "@tonconnect/ui-react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Account, AccountContextProvider } from "../contexts/account";
import { Account as AccountWrapper } from "../protocol";
import React, { useState } from "react";
import { useTon } from "../contexts/tonClient";
import { useLoader } from "../contexts/loader";
import { useServiceController } from "../contexts/serviceController";
import { useEffect } from "react";
import { Address, Dictionary } from "@ton/core";
import { useCallback } from "react";
import { useNavbarControls } from "../contexts/navbar";
import { Drawer } from "../features/Drawer";
import { getAccountWrapper } from "../utils/addresses";

const useAccountState = () => {
  const [refresher, setRefresher] = useState(0);

  const ton = useTon();
  const loader = useLoader();
  const wallet = useTonWallet();

  const controller = useServiceController();
  const [account, setAccount] = useState<Account | undefined>();

  useEffect(() => {
    if (!ton) return;
    if (!controller.loaded) return;

    const walletAddressStr = wallet!.account.address;

    const walletAddress = Address.parse(walletAddressStr);

    const loadServiceAccount = async () => {
      const accountWrapper = await getAccountWrapper(
        controller.contract,
        walletAddress
      );

      const isDeployed = await ton.client.isContractDeployed(
        accountWrapper.address
      );

      if (!isDeployed) {
        setAccount({
          deployed: false,
          address: accountWrapper.address,
        });
        return;
      }

      const contract = ton.cachedOpenContract(accountWrapper);
      const data = await contract.getData();

      setAccount({
        address: accountWrapper.address,
        deployed: true,
        contract: contract,
        data: data,
      });
    };

    loader.show("Locating user account.");
    loadServiceAccount().finally(loader.hide);
    // TODO: handle exceptions.
  }, [ton, controller, refresher]);

  const refreshAccount = useCallback(() => {
    setRefresher((refresher + 1) % 1000);
  }, [controller, wallet, account]);

  return {
    account,
    refreshAccount,
  };
};

export const AccountZone = () => {
  const loader = useLoader();
  const location = useLocation();
  const navigate = useNavigate();

  const navBarControls = useNavbarControls();
  const { account, refreshAccount } = useAccountState();

  useEffect(() => {
    loader.show("Fetching account");

    navBarControls.setShowBurger(false);

    if (account === undefined) return;

    if (!account.deployed) {
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

  if (!account || !account.deployed) {
    return <></>;
  }

  return (
    <AccountContextProvider account={account!} refreshAccount={refreshAccount}>
      <Drawer>
        <Outlet />
      </Drawer>
    </AccountContextProvider>
  );
};
