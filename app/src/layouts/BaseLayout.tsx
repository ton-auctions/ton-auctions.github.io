import React from "react";
import { TonClientProvider } from "../contexts/tonClient";
import { ServiceControllerProvider } from "../contexts/serviceController";
import { Background } from "../components/Background";
import { LoaderProvider } from "../contexts/loader";
import { Link, Outlet } from "react-router";
import { AlertContextProvider } from "../contexts/alerts";

type BaseLayoutProps = {
  controllerAddress: string;
  apiKey: string;
};

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  controllerAddress,
  apiKey,
}) => {
  return (
    <TonClientProvider
      endpointV2="https://testnet.toncenter.com/api/v2/jsonRPC"
      endpointV3="https://testnet.toncenter.com/api/v3/"
      apiKey={apiKey}
    >
      <ServiceControllerProvider address={controllerAddress}>
        <div className="absolute h-full w-full min-w-3xs">
          <AlertContextProvider>
            <Background />

            <LoaderProvider>
              <Outlet />
            </LoaderProvider>
          </AlertContextProvider>
        </div>
      </ServiceControllerProvider>
    </TonClientProvider>
  );
};
