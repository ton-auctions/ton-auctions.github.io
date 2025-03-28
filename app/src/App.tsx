import * as React from "react";
import "./index.css";
import {
  TonConnectUIProvider,
  TonConnectButton,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useEffect } from "react";
import { WebApp } from "@grammyjs/web-app";

const manifest = new URL("./ton-connect-manifest.json", import.meta.url);

const CONTROLLER_ADDRESS = "EQAs3c0OAgJHg4Jq__YwHEIaqM8MmcGzjzzksKGz0zEBJCN6";

function App() {
  // const wallet = useTonWallet();

  useEffect(() => {
    console.log(WebApp.initDataUnsafe.chat?.id);
    console.log(WebApp.initDataUnsafe.chat?.username);
  }, []);

  return (
    <TonConnectUIProvider manifestUrl={manifest.href}>
      <div>
        <header className="flex flex-col items-center justify-center min-h-screen bg-gray-700 text-white">
          <span>My App with React UI</span>
          <span>{JSON.stringify(WebApp.initDataUnsafe)}</span>
          <TonConnectButton />
        </header>
      </div>
    </TonConnectUIProvider>
  );
}

export default App;
