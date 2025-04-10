import React, { useCallback, useEffect, useRef, useState } from "react";

import { createContext } from "react";
import { useContext } from "react";

type AlertData = {
  id: string;
  text: string;
  timeout: number;
};

type AlertContextValue = {
  addAlert: (text: string, timeout: number) => void;
};

export const AlertContext = createContext<AlertContextValue>({
  addAlert: (text: string, timeout: number) => {},
});

type AlertProps = {
  text: string;
  timeout: number;
  onTimeout: () => void;
};

const Alert: React.FC<AlertProps> = ({ text, timeout, onTimeout }) => {
  useEffect(() => {
    const timeoutHandle = setTimeout(onTimeout, timeout);
    return () => {
      clearTimeout(timeoutHandle);
    };
  }, []);

  return (
    <div className="relative mx-auto text-gray-200 z-100 w-xs">{text}</div>
  );
};

export const AlertContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const addAlert = (text: string, timeout: number) => {
    setAlerts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        timeout,
      },
    ]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id != id));
  };

  return (
    <AlertContext.Provider
      value={{
        addAlert: (text: string, timeout: number) => {
          addAlert(text, timeout);
        },
      }}
    >
      <>
        {children}
        <div className="absolute stack bottom-0 h-20 w-xs">
          {alerts.map((a, idx) => (
            <Alert
              key={a.id}
              text={a.text}
              timeout={a.timeout}
              onTimeout={() => {
                // removeAlert(a.id);
              }}
            />
          ))}
        </div>
      </>
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
