import { Message } from "./indexerClient.ts";
import { Network } from "./networks.ts";
import { DAO, getDAO } from "../data/dao.ts";
import * as wrappers from "../processor/protocolWrappers.ts";
import { getLogger } from "@std/log";

export type MessageProvider = (
  opcode: string,
  last_seen_lt: bigint,
  network: Network
) => AsyncGenerator<Message, void, unknown>;

export const startReadingMessages = async function* (
  network: Network,
  opcode: string,
  messageProvider: MessageProvider,
  storage?: DAO
) {
  const logger = getLogger("fetcher.process");

  storage = storage || (await getDAO());

  if (!storage.messages.opcodeExists(network.name, opcode)) {
    storage.messages.registerOpcode(network.name, opcode);
  }

  let last_seen_lt;
  while (true) {
    last_seen_lt = storage.messages.getLastSeenLtForOpcode(
      network.name,
      opcode
    );

    let batchSize = 0;
    try {
      for await (const message of messageProvider(
        opcode,
        last_seen_lt,
        network
      )) {
        batchSize += 1;
        const createdLt = BigInt(message.created_lt);
        // TODO: what if message hash exists?
        storage.messages.addMessage({
          opcode: message.opcode,
          msgHash: message.hash,
          bodyRaw: message.message_content.body,
          createdLt: createdLt,
          network: network.name,
          notificationSentAt: null,
          reservedForSendingAt: null,
          reserveCount: 0,
        });

        storage.messages.updateLastSeenLtForOpcode(
          createdLt,
          network.name,
          opcode
        );

        logger.debug("Message processed", {
          name: "fetcher",
          opcode,
          message_hash: message.hash,
          created_lt: createdLt.toString(),
          network_name: network.name,
        });
      }
    } catch (e) {
      if (e instanceof Error) {
        logger.error("Error during batch fetching", {
          err: e.cause,
          msg: e.message,
          stack: e.stack,
        });
      } else {
        logger.error("Error during batch fetching", {
          err: "unknown",
          msg: "",
          stack: "",
        });
      }
    }

    logger.info("Batch fetched", {
      name: "fetcher",
      opcode,
      network_name: network.name,
      last_seen_lt: last_seen_lt.toString(),
      batch_size: batchSize,
    });
    yield;
  }
};

export const getBatchFetcher = (
  network: Network,
  messageProvider: MessageProvider,
  dao?: DAO
) => {
  const fetchers = [
    startReadingMessages(
      network,
      wrappers.AccountInitialisedEventOpcode,
      messageProvider,
      dao
    ),
    startReadingMessages(
      network,
      wrappers.AuctionCreatedEventOpcode,
      messageProvider,
      dao
    ),
    startReadingMessages(
      network,
      wrappers.AuctionOutbiddedEventOpcode,
      messageProvider,
      dao
    ),
    startReadingMessages(
      network,
      wrappers.AuctionResolvedEventOpcode,
      messageProvider,
      dao
    ),
    startReadingMessages(
      network,
      wrappers.ProfitReceivedEventOpcode,
      messageProvider,
      dao
    ),
  ];

  return () => {
    return Promise.all(fetchers.map((v) => v.next()));
  };
};
