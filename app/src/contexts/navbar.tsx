import React from "react";

import { Address, OpenedContract } from "@ton/core";
import { createContext } from "react";
import { useContext } from "react";
import { Account as AccountWrapper, AccountData } from "../protocol";

type NavbarControls = {
  setShowBurger: (value: boolean) => void;
};

export const NavbarContext = createContext<NavbarControls>({
  setShowBurger: (value: boolean) => false,
});

type AccountContextProviderProps = React.PropsWithChildren & {
  setShowBurger: (value: boolean) => void;
};

export const NavbarContextProvider: React.FC<AccountContextProviderProps> = ({
  children,
  setShowBurger,
}) => {
  return (
    <NavbarContext.Provider value={{ setShowBurger }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbarControls = () => useContext(NavbarContext);
