import {
  Address,
  Contract,
  OpenedContract,
  Sender,
  SenderArguments,
  TonClient,
} from "@ton/ton";
import { useEffect, useState, use, cache } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";

export function useInit<T>(func: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<T | undefined>();

  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}

export function useContractWrapper<T extends Contract>(client, contract: T) {
  return useInit(async () => {
    if (!client) return;

    // const contract = fromAddress(
    //   Address.parse("EQAs3c0OAgJHg4Jq__YwHEIaqM8MmcGzjzzksKGz0zEBJCN6")
    // );

    return client.open(contract) as OpenedContract<T>;
  }, [client]);
}

export function useConnection(): { sender: Sender; connected: boolean } {
  // TODO: refactor
  const [TonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        await TonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 6 * 60 * 1000,
        });
      },
    },
    connected: TonConnectUI.connected,
  };
}
