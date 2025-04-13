import React, { useCallback, useEffect, useRef, useState } from "react";

import { createContext } from "react";
import { useContext } from "react";

type AlertData = {
  id: string;
  title: string;
  text: string;
  timeout: number;
};

type AlertContextValue = {
  addAlert: (title: string, text: string, timeout: number) => void;
};

export const AlertContext = createContext<AlertContextValue>({
  addAlert: (title: string, text: string, timeout: number) => {},
});

type AlertProps = {
  title: string;
  text: string;
  timeout: number;
  onTimeout: () => void;
};

const Alert: React.FC<AlertProps> = ({ title, text, timeout, onTimeout }) => {
  useEffect(() => {
    console.log(onTimeout, timeout);
    const timeoutHandle = setTimeout(onTimeout, timeout);
    return () => {
      // clearTimeout(timeoutHandle);
    };
  }, []);

  return (
    <div className="grid flex-col text-gray-200 glass">
      <div className="relative h-full w-full flex pl-5 pr-5 pt-2">
        <div className="grow ">
          <h1 className="text-lg">{title}</h1>
          <p>{text}</p>
        </div>
        <div className="btn btn-ghost btn-link" onClick={() => onTimeout()}>
          X
        </div>
      </div>
    </div>
  );
};

export const AlertContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const addAlert = (title: string, text: string, timeout: number) => {
    setAlerts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        text,
        timeout,
      } as AlertData,
    ]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id != id));
  };

  return (
    <AlertContext.Provider
      value={{
        addAlert: addAlert,
      }}
    >
      <>
        {children}
        <div className="absolute bottom-0 stack h-20 w-full z-100">
          {alerts.map((a, idx) => (
            <Alert
              key={a.id}
              title={a.title}
              text={a.text}
              timeout={a.timeout}
              onTimeout={() => {
                removeAlert(a.id);
              }}
            />
          ))}
        </div>
      </>
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
