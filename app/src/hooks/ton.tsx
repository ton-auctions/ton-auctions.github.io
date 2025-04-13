import { Sender, SenderArguments } from "@ton/core";
import { useTonConnectUI } from "@tonconnect/ui-react";

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
