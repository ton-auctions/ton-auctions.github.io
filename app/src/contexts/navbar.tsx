import React from "react";

import { createContext } from "react";
import { useContext } from "react";

interface NavbarControls {
  setShowBurger: (value: boolean) => void;
}

export const NavbarContext = createContext<NavbarControls>({
  setShowBurger: () => false,
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
