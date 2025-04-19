import React from "react";

import { createContext } from "react";
import { useContext } from "react";

interface NavbarControls {
  setShowBurger: (value: boolean) => void;
}

export const NavbarContext = createContext<NavbarControls>({
  setShowBurger: () => false,
});

type NavbarContextProviderProps = React.PropsWithChildren & {
  setShowBurger: (value: boolean) => void;
};

export const NavbarContextProvider: React.FC<NavbarContextProviderProps> = ({
  children,
  setShowBurger,
}) => {
  return (
    <NavbarContext.Provider value={{ setShowBurger }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbarContext = () => useContext(NavbarContext);
