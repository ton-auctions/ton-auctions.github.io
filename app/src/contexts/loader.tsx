import React from "react";
import { proxy, useSnapshot } from "valtio";
import Loader from "../components/Loader";
import { useContext } from "react";

export const loaderState = proxy({
  isLoading: false,
  caption: "Loading",
});

export interface LoaderContextValue {
  show(caption: string): void;
  hide(): string;
}

let _showTimeout: NodeJS.Timeout;
let _hideTimeout: NodeJS.Timeout;

const contextValue = {
  show: (caption: string) => {
    clearTimeout(_showTimeout);
    clearTimeout(_hideTimeout);
    _showTimeout = setTimeout(() => {
      loaderState.caption = caption;
      loaderState.isLoading = true;
    }, 0);
  },
  hide: () => {
    clearTimeout(_showTimeout);
    clearTimeout(_hideTimeout);
    _hideTimeout = setTimeout(() => {
      loaderState.caption = "";
      loaderState.isLoading = false;
    }, 500);
  },
} as LoaderContextValue;

export const LoaderContext =
  React.createContext<LoaderContextValue>(contextValue);

export const LoaderProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const snap = useSnapshot(loaderState);

  return (
    <LoaderContext.Provider value={contextValue}>
      <Loader hidden={!snap.isLoading} caption={snap.caption} />
      <div
        className="flex flex-col relative w-full h-full z-50"
        hidden={snap.isLoading}
      >
        {children}
      </div>
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
