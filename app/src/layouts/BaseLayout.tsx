import React from "react";
import { TonClientProvider } from "../contexts/tonClient";
import { ServiceControllerProvider } from "../contexts/serviceController";
import { Background } from "../components/Background";
import { LoaderProvider } from "../contexts/loader";
import { Outlet } from "react-router";
import { Navbar } from "../features/Navbar";

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
          <Background />

          <LoaderProvider>
            <div className="drawer h-full">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content h-full">
                <Navbar />

                <Outlet />
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="my-drawer"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                  <li>
                    <a>Profile settings</a>
                  </li>
                  <li>
                    <a>Create auction</a>
                  </li>
                </ul>
              </div>
            </div>
          </LoaderProvider>
        </div>
      </ServiceControllerProvider>
    </TonClientProvider>
  );
};
