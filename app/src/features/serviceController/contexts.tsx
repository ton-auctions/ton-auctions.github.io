import { Address, OpenedContract } from "@ton/ton";
import React from "react";
import { createContext } from "react";
import { Controller } from "../../protocol";
import { TonContextValue, useTon } from "../tonClient";

type ClientContextValue = OpenedContract<Controller> | undefined;

const createContextValue = (ton: TonContextValue, address: Address) => {
  return ton.cachedOpenContract(Controller.fromAddress(address));
};

export const ServiceControllerContext =
  createContext<ClientContextValue>(undefined);

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
