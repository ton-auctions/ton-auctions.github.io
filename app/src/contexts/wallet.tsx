import React, { createContext, useContext, useEffect, useState } from "react";

import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

import { useLoaderContext } from "./loader";
import { useNavigate } from "react-router";
import { useIsConnectionRestored } from "@tonconnect/ui-react";
import { Address } from "@ton/core";

export interface ConnectedWallet {
  address: Address;
  connected: true;
  disconnect: () => Promise<void>;
}

export interface NoWallet {
  connected: false;
}

export type State = ConnectedWallet | NoWallet;

export const WalletContext = createContext<State>({ connected: false });

type WalletContextProviderProps = React.PropsWithChildren & {
  redirectTo?: string;
  onConnect?: () => Promise<void>;
};

export const WalletContextProvider: React.FC<WalletContextProviderProps> = ({
  children,
  redirectTo,
  onConnect,
}) => {
  const loader = useLoaderContext();

  const [ui] = useTonConnectUI();
  const tonWallet = useTonWallet();
  const connectionRestored = useIsConnectionRestored();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState<State | undefined>();

  useEffect(() => {
    loader.show("Checking connection");

    if (!connectionRestored) return;

    const wallet =
      tonWallet == null
        ? ({ connected: false } as NoWallet)
        : ({
            connected: true,
            address: Address.parse(tonWallet.account.address),
            disconnect: async () => {
              await ui.disconnect();
            },
          } as ConnectedWallet);

    setWallet(wallet);
    loader.hide();

    if (!wallet.connected && redirectTo) {
      navigate(redirectTo, { state: { forward: location.pathname } });
    } else {
      if (onConnect) onConnect();
    }
  }, [tonWallet, connectionRestored]);

  if (wallet === undefined) {
    return <></>;
  }

  // NOTE: Turns out <Navigate to="account" /> executes before logic in useEffect.
  if (!wallet.connected && redirectTo) {
    return <></>;
  }

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
