import { getBatchProcessor } from "./processor/process.ts";
import { getBatchFetcher } from "./fetcher/process.ts";
import { Network, NETWORKS } from "./fetcher/networks.ts";
import { getDAO } from "./data/dao.ts";
import { requestMessages } from "./fetcher/indexerClient.ts";
import { registerStart } from "./bot/start.ts";
import { registerAuctions } from "./bot/auctions.ts";
import { registerMock } from "./bot/mock.ts";
import { Bot } from "gramio";
import { registerMessaging } from "./bot/messaging.ts";
import setupLogging from "./logging.ts";

const bot = await (async () => {
  const storage = await getDAO();
  const bot = new Bot(Deno.env.get("BOT_TOKEN")!, {
    api: {
      useTest: Deno.env.get("IS_TEST") === "1",
    },
  });

  // Register commands
  // TODO: lacks functionality to terminate messaging
  // TODO: bad events can create misinformation.
  registerStart(bot, storage);
  registerAuctions(bot, storage);
  registerMock(bot, storage);
  registerMessaging(bot, storage);

  return bot;
})();

let stop = false;

const fetcherProcess = async (network: Network) => {
  const messageProvider = (
    opcode: string,
    lastSeenLt: bigint,
    network: Network
  ) => requestMessages(opcode, lastSeenLt, network);

  const iterate = getBatchFetcher(network, messageProvider);

  while (!stop) {
    await iterate();
  }
};

const processorProcess = async (network: Network) => {
  const dao = await getDAO();

  const interator = getBatchProcessor(
    async (chatId: string, text: string) => {
      await bot.api.sendMessage({ chat_id: chatId, text: text });
    },
    dao,
    Deno.env.get("SK")!,
    network
  );

  while (!stop) {
    await interator.next();
  }
};

const network =
  Deno.env.get("IS_TEST") == "1" ? NETWORKS.TESTNET : NETWORKS.MAINNET;

if (import.meta.main) {
  setupLogging();

  await Promise.all([
    bot.start(),
    fetcherProcess(network),
    processorProcess(network),
  ]);
}
