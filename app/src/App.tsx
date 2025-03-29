import * as React from "react";
import "./index.css";
import {
  TonConnectUIProvider,
  TonConnectButton,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useEffect } from "react";

// const CONTROLLER_ADDRESS = "EQAs3c0OAgJHg4Jq__YwHEIaqM8MmcGzjzzksKGz0zEBJCN6";

function View() {
  const wallet = useTonWallet();

  // {/* <span>{JSON.stringify(WebApp.initDataUnsafe)}</span> */}
  return (
    <React.Fragment>
      <span>My App with React UI</span>
      {wallet?.account.address}
    </React.Fragment>
  );
}

function App() {
  useEffect(() => {}, []);

  return (
    <TonConnectUIProvider
      manifestUrl={"https://ton-auctions.github.io/ton-connect-manifest.json"}
    >
      <div>
        <TonConnectButton />
      </div>
    </TonConnectUIProvider>
  );
}

export default App;
