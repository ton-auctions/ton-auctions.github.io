import { Address, OpenedContract } from "@ton/core";
import React from "react";
import { createContext } from "react";
import { Controller } from "../protocol";
import { TonContextValue, useTon } from "./tonClient";
import { useContext } from "react";

interface UninitialisedController {
  loaded: false;
}

interface InitilisedController {
  loaded: true;
  contract: OpenedContract<Controller>;
}

type ControllerContract = UninitialisedController | InitilisedController;

const createContextValue = (ton: TonContextValue, address: Address) => {
  const _contract = ton.cachedOpenContract(Controller.fromAddress(address));

  return {
    loaded: true,
    contract: _contract,
  } as InitilisedController;
};

export const ServiceControllerContext = createContext<ControllerContract>({
  loaded: false,
} as UninitialisedController);

type ServiceControllerProviderProps = React.PropsWithChildren & {
  address: string;
};

export const ServiceControllerProvider: React.FC<
  ServiceControllerProviderProps
> = ({ children, address }) => {
  const ton = useTon();

  return (
    <ServiceControllerContext.Provider
      value={createContextValue(ton, Address.parse(address))}
    >
      {children}
    </ServiceControllerContext.Provider>
  );
};

export const useServiceController = () => useContext(ServiceControllerContext);
