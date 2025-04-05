import { useCallback, useEffect, useState } from "react";
import {
  TonConnectUIProvider,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";

import { Background } from "./components/Background";
import { Fullscreen } from "./components/Fullscreen";

import { LoaderProvider, useLoader } from "./features/loader";
import { useTMA } from "./hooks/tma";
import { ConnectWallet } from "./components/ConnectWallet";
import { useConnection } from "./hooks/ton";
import { Account, AccountData } from "./protocol";
import {
  Address,
  OpenedContract,
  SendMode,
  toNano,
  Transaction,
} from "@ton/core";
import {
  TonClientProvider,
  TonContextValue,
  useTon,
} from "./features/tonClient";
import {
  ServiceControllerProvider,
  useServiceController,
} from "./features/serviceController";
import { WalletV5 } from "./protocol/wallet_v5";
import { TonClient } from "@ton/ton";
import { Tx } from "./features/tonClient/contexts";
import React from "react";

const CONTROLLER_ADDRESS = "EQAAgxde7iDFWgj0pYL_eJQEoIFg9ZgrprTypuxY_uldJEiZ";

// CTRLR
// 0:f7049b43efd4813fc45161733648a235f18ea1ccb5d95916d94e5e602c843461
// b : EQD3BJtD79SBP8RRYXM2SKI18Y6hzLXZWRbZTl5gLIQ0YZY8
// nb: UQD3BJtD79SBP8RRYXM2SKI18Y6hzLXZWRbZTl5gLIQ0Ycv5
// b : kQD3BJtD79SBP8RRYXM2SKI18Y6hzLXZWRbZTl5gLIQ0YS22
// nb: 0QD3BJtD79SBP8RRYXM2SKI18Y6hzLXZWRbZTl5gLIQ0YXBz

//  Wallet address non-bounce: 0QBKrZkHjRetJ_eZKWCJFRkThnFmZXBOVr8qaY9mhO9Hckle
//                     bounce: kQBKrZkHjRetJ_eZKWCJFRkThnFmZXBOVr8qaY9mhO9HchSb

type UndeployedServiceAccount = {
  deployed: false;
};

type DeployedServiceAccount = {
  deployed: true;
  contract: OpenedContract<Account>;
  data: AccountData;
};

type ServiceAccount = UndeployedServiceAccount | DeployedServiceAccount;

const useWalletContract = (ton: TonContextValue) => {
  const [walletContract, setWalletContract] = useState<
    OpenedContract<WalletV5> | undefined
  >();

  const wallet = useTonWallet();

  useEffect(() => {
    if (!wallet) return;

    setWalletContract(
      ton.cachedOpenContract(
        WalletV5.createFromAddress(Address.parse(wallet.account.address))
      )
    );
  });

  return walletContract;
};

const useUserAccount = (
  tonContext: TonContextValue
): [ServiceAccount, () => void] => {
  const [refresher, setRefresher] = useState(0);

  const loader = useLoader();
  const wallet = useTonWallet();
  useWalletContract(tonContext);

  const controller = useServiceController();
  const [account, setAccount] = useState<ServiceAccount>({
    deployed: false,
  });

  useEffect(() => {
    const walletAddressStr = wallet?.account.address;

    if (!walletAddressStr) return;
    if (!tonContext) return;
    if (!controller) return;

    const walletAddress = Address.parse(walletAddressStr);

    const loadServiceAccount = async () => {
      const accountAddress = await controller.getUserAccount(walletAddress);

      const isDeployed = await tonContext.client.isContractDeployed(
        accountAddress
      );

      if (!isDeployed) {
        setAccount({ deployed: false });
        return;
      }

      const contract = tonContext.cachedOpenContract(
        Account.fromAddress(accountAddress)
      );
      const data = await contract.getData();

      setAccount({
        deployed: true,
        contract: contract,
        data: data,
      });
    };

    loader.show("Locating user account.");
    loadServiceAccount().finally(loader.hide);
    // TODO: handle exceptions.
  }, [wallet, tonContext, controller, refresher]);

  const refresh = () => {
    setRefresher((refresher + 1) % 1000);
  };

  return [account, refresh];
};

type RegistrationPageProps = {
  account: UndeployedServiceAccount;
  onAccountChange: () => void;
};

const waitTillExists = async (client: TonContextValue, src: Address) => {
  let contractExists = true;
  while (contractExists) {
    contractExists = await client.client.isContractDeployed(src);
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
};

// TODO: move into context value
const waitForTransaction = async (
  client: TonContextValue,
  src: Address,
  dst: Address,
  since: Transaction
) => {
  const latestLt = since.lt - 1n;

  let transactionFound = false;
  while (!transactionFound) {
    let transactions: Tx[] = await client.getTransactions(dst, latestLt);

    const hasMessage = transactions.some((tx) => {
      return (
        tx.in.source.toString() == src.toString() &&
        tx.in.destination.toString() == dst.toString()
      );
    });

    if (hasMessage) break;

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
};

const RegistrationPage: React.FC<RegistrationPageProps> = ({
  account,
  onAccountChange,
}) => {
  const loader = useLoader();

  const [ui] = useTonConnectUI();
  const connection = useConnection();
  const controller = useServiceController();

  const ton = useTon();
  const wallet = useWalletContract(ton);

  const register = useCallback(async () => {
    if (!account) return;
    if (!controller) return;
    if (!wallet) return;

    // At least wallet creation transaction should exist.
    const tx = await ton.client.getTransactions(controller.address, {
      limit: 1,
    });

    loader.show("Creating account. Sending transaction.");

    try {
      await controller.send(
        connection.sender,
        { value: toNano("0.1"), bounce: true },
        {
          $$type: "CreateAccount",
          chat_id: 0n,
          referree: null,
        }
      );
    } catch (e) {
      // TODO: manually test for insufficient TON
      console.log("JOPA");
    }

    loader.show("Creating account. Waiting for transation to settle.");
    await waitForTransaction(ton, wallet.address, controller.address, tx[0]);
    loader.hide();
    onAccountChange();
  }, [account, controller, wallet]);

  const disconnect = useCallback(() => {
    ui.disconnect();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="text-gray-100">
        <button onClick={register}>REGISTRATION</button>
      </div>
      <div className="text-gray-100">
        <button onClick={disconnect}>DISSCONNECT</button>
      </div>
    </div>
  );
};

type AuctionsProps = {
  account: DeployedServiceAccount;
  onAccountChange: () => void;
};

type CreateAuctionProps = {
  account: DeployedServiceAccount;
  onAccountChange: () => void;
};

const CreateAuction: React.FC<CreateAuctionProps> = ({
  account,
  onAccountChange,
}) => {
  return (
    <div>
      <textarea></textarea>
      <textarea></textarea>
    </div>
  );
};

const Auctions: React.FC<AuctionsProps> = ({ account, onAccountChange }) => {
  const conn = useConnection();
  const loader = useLoader();
  const ton = useTon();
  const wallet = useWalletContract(ton);
  const controller = useServiceController();

  const deleteAccount = useCallback(async () => {
    if (!account) return;
    if (!conn) return;
    if (!wallet) return;
    if (!controller) return;

    loader.show("Deleting account. Signing transaction.");

    const tx = await ton.client.getTransactions(wallet.address, { limit: 1 });
    loader.show("Creating account. Sending transaction.");

    await account.contract.send(
      conn.sender,
      {
        value: toNano("0.05"),
      },
      {
        $$type: "AccountDelete",
      }
    );

    loader.show("Deleting account. Waiting for transaction to settle.");
    await waitTillExists(ton, account.contract.address);
    loader.hide();
    onAccountChange();
  }, [account]);

  const createAuction = useCallback(async () => {}, [account]);

  console.log(account.data.auctions.keys());

  let z = account.data.auctions.keys().map((key) => {
    return <div>sss</div>;
  });

  return (
    <div className="text-gray-100">
      <button onClick={deleteAccount}>DELETE ACCOUNT</button>
      {z}
    </div>
  );
};

const AccountPage = () => {
  const tonContext = useTon();
  const [userAccount, refreshAccount] = useUserAccount(tonContext);

  if (!userAccount.deployed) {
    return (
      <RegistrationPage
        account={userAccount}
        onAccountChange={refreshAccount}
      />
    );
  }

  return <Auctions account={userAccount} onAccountChange={refreshAccount} />;
};

const Page = () => {
  const tma = useTMA();
  const wallet = useTonWallet();
  const loader = useLoader();

  if (tma == undefined) {
    loader.show("Initialising");
    return <></>;
  }
  loader.hide();

  if (wallet) {
    return <AccountPage />;
  } else {
    return <ConnectWallet />;
  }
};

function PresentationPage() {
  const loader = useLoader();

  loader.show("Presentation");

  return <div className="flex w-30 h-30 bg-red-100 z-10"></div>;
}

function Root() {
  return (
    <>
      <Fullscreen>
        <Background />

        <LoaderProvider>
          <Page></Page>
        </LoaderProvider>
      </Fullscreen>
    </>
  );
}

function App() {
  return (
    <TonConnectUIProvider
      manifestUrl={"https://ton-auctions.github.io/ton-connect-manifest.json"}
    >
      <TonClientProvider
        endpointV2="https://testnet.toncenter.com/api/v2/jsonRPC"
        endpointV3="https://testnet.toncenter.com/api/v3/"
        apiKey="6f70772f00d62c4d3cc75f0037b6344a916901d447672b98f7267f25ad2e7b8b"
      >
        <ServiceControllerProvider address={CONTROLLER_ADDRESS}>
          <Root />
        </ServiceControllerProvider>
      </TonClientProvider>
    </TonConnectUIProvider>
  );
}

export default App;
