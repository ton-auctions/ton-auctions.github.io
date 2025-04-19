import React, { useEffect, useState } from "react";

import { createContext } from "react";
import { useContext } from "react";

interface AlertData {
  id: string;
  title: string;
  text: string;
  timeout: number;
}

interface AlertContextValue {
  addAlert: (title: string, text: string, timeout: number) => void;
}

export const AlertContext = createContext<AlertContextValue>({
  addAlert: () => {
    throw new Error("Uninmplemeted addAlert");
  },
});

interface AlertProps {
  title: string;
  text: string;
  timeout: number;
  onTimeout: () => void;
}

const Alert: React.FC<AlertProps> = ({ title, text, timeout, onTimeout }) => {
  useEffect(() => {
    const timeoutHandle = setTimeout(onTimeout, timeout);
    return () => {
      clearTimeout(timeoutHandle);
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
        <div className="absolute bottom-0 stack h-20 w-full z-100 overflow-hidden">
          {alerts.map((a) => (
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

export const useAlertsContext = () => useContext(AlertContext);
