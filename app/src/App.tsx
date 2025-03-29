import * as React from "react";
import "./index.css";
import { useEffect } from "react";
import {
  TonConnectUIProvider,
  TonConnectButton,
  useTonWallet,
} from "@tonconnect/ui-react";

// const CONTROLLER_ADDRESS = "EQAs3c0OAgJHg4Jq__YwHEIaqM8MmcGzjzzksKGz0zEBJCN6";

function MainPage() {
  const wallet = useTonWallet();

  // const z = use

  //   // {/* <span>{JSON.stringify(WebApp.initDataUnsafe)}</span> */}
  //   return (
  //     <React.Fragment>
  //       <span>My App with React UI</span>
  //       {wallet?.account.address}
  //     </React.Fragment>
  //   );

  return (
    <React.Fragment>
      <TonConnectButton />
    </React.Fragment>
  );
}

function App() {
  useEffect(() => {}, []);

  return (
    <TonConnectUIProvider
      manifestUrl={"https://ton-auctions.github.io/ton-connect-manifest.json"}
    >
      <MainPage />
    </TonConnectUIProvider>
  );
}

export default App;
