import { DAO } from "../data/dao.ts";
import {
  AccountInitialisedEvent,
  AuctionCreatedEvent,
  AuctionOutbiddedEvent,
  AuctionResolvedEvent,
  MESSAGE_PARSERS,
  ProfitReceivedEvent,
} from "./protocolWrappers.ts";
import { Cell } from "@ton/core";
import { decrypt, sha256 } from "../utils/crypto.ts";
import { Network } from "../fetcher/networks.ts";
import { getLogger } from "@std/log";

const decryptUserId = async (secret_id: Cell, sk: string) => {
  const slice = secret_id.beginParse();
  const buffer = slice.loadBuffer(slice.remainingBits / 8);
  const decrypted = decrypt(Uint8Array.from(buffer), sk);
  const userId = Number.parseInt(decrypted.toString("hex"), 16);
  return await sha256(userId);
};

type SendHandle = (chatId: string, message: string) => Promise<void>;

const onAccountInitialised = async (
  msgHash: string,
  sk: string,
  storage: DAO,
  send: SendHandle,
  parsedMessage: AccountInitialisedEvent
) => {
  const logger = getLogger("processor.process.handler");
  // return;
  const userIdHash = await decryptUserId(parsedMessage.secret_id, sk);
  const user = storage.users.getUser(userIdHash);

  if (user == undefined) {
    logger.info("Could not process message", {
      type: "AccountInitialised", // todo: enum
      reason: "User not found",
      userIdHash: userIdHash,
    });
    return;
  }

  const accountAddress = parsedMessage.address;

  // need to open account and check for correct collector address.

  storage.users.saveAccount({
    address: accountAddress,
    userIdHash: user.userIdHash,
  });

  await send(
    user.chatId.toFixed(0),
    `
    Hey hey! We noticed you've created account ${accountAddress.toString()}. 
    Well done!. 
    `
  );
  storage.messages.markNotificationSent(msgHash);
  logger.info("Message processed", {
    type: "AccountInitialised", // todo: enum
    userIdHash: userIdHash,
  });
};

const onProfitReceived = async (
  msgHash: string,
  sk: string,
  storage: DAO,
  send: SendHandle,
  parsedMessage: ProfitReceivedEvent
) => {
  const logger = getLogger("processor.process.handler");

  const userIdHash = await decryptUserId(parsedMessage.secret_id, sk);
  const user = storage.users.getUser(userIdHash);

  if (user == undefined) {
    logger.info("Could not process message", {
      type: "ProfitReceived", // todo: enum
      reason: "User not found",
      userIdHash: userIdHash,
    });
    return;
  }

  await send(
    user.chatId.toFixed(0),
    `
    Congrats you've just made ${(
      Number(parsedMessage.amount) / 1000000000
    ).toFixed(2)} TON.
    Well done!. 
    `
  );
  storage.messages.markNotificationSent(msgHash);
  logger.info("Message processed", {
    type: "ProfitReceived", // todo: enum
    userIdHash: userIdHash,
  });
};

const onAuctionCreated = async (
  msgHash: string,
  sk: string,
  storage: DAO,
  send: SendHandle,
  parsedMessage: AuctionCreatedEvent
) => {
  const logger = getLogger("processor.process.handler");
  const userIdHash = await decryptUserId(parsedMessage.owner_secret_id, sk);
  const addr = parsedMessage.address;
  const user = storage.users.getUser(userIdHash);

  if (user == undefined) {
    logger.info("Could not process message", {
      type: "AuctionCreated", // todo: enum
      reason: "User not found",
      userIdHash: userIdHash,
    });
    return;
  }

  storage.auctions.add(
    userIdHash,
    addr,
    parsedMessage.name,
    parsedMessage.ends_at
  );

  await send(
    user.chatId.toFixed(0),
    `
    New auction?! Niiiiiice!
    Well done!. 
    `
  );
  storage.messages.markNotificationSent(msgHash);

  logger.info("Message processed", {
    type: "AuctionCreated", // todo: enum
    auctionAddress: addr.toString(),
  });
};

const onAuctionResolved = async (
  msgHash: string,
  sk: string,
  storage: DAO,
  send: SendHandle,
  parsedMessage: AuctionResolvedEvent
) => {
  const logger = getLogger("processor.process.handler");
  const addr = parsedMessage.address;
  const ownerIdHash = await decryptUserId(parsedMessage.owner_secret_id, sk);

  const auction = storage.auctions.get(addr);

  if (auction == undefined) {
    logger.info("Could not process message", {
      type: "AuctionResolved", // todo: enum
      reason: "Auction not found",
      auctionAddress: addr.toString(),
    });

    return;
  }

  const user = storage.users.getUser(ownerIdHash);

  if (user == undefined) {
    logger.info("Could not process message", {
      type: "AuctionResolved", // todo: enum
      reason: "Owner not found",
      ownerIdHash: ownerIdHash,
      auctionAddress: addr.toString(),
    });
    return;
  }

  if (parsedMessage.winner_secret_id === null) {
    await send(user.chatId.toFixed(0), `Auction deleted. Well done!. `);

    storage.auctions.markDeleted(addr);

    return;
  }

  const winner_id_hash = await decryptUserId(
    parsedMessage.winner_secret_id,
    sk
  );

  await send(
    user.chatId.toFixed(0),
    `
    New auction?! Niiiiiice!
    Well done!. 
    `
  );
  storage.auctions.addWinner(addr, winner_id_hash);
  storage.messages.markNotificationSent(msgHash);

  logger.info("Message processed", {
    type: "AuctionResolved", // todo: enum
    auctionAddress: addr.toString(),
  });
};

const onAuctionOutbiddedEvent = async (
  msgHash: string,
  sk: string,
  storage: DAO,
  send: SendHandle,
  parsedMessage: AuctionOutbiddedEvent
) => {
  const logger = getLogger("processor.process.handler");
  const addr = parsedMessage.address;

  const oldWinnerHashId = await decryptUserId(
    parsedMessage.old_winner_secret_id,
    sk
  );
  const newWinnerHashId = await decryptUserId(
    parsedMessage.new_winner_secret_id,
    sk
  );

  const auction = storage.auctions.get(addr);
  if (auction == undefined) {
    logger.info("Could not process message", {
      type: "AuctionOutbidded", // todo: enum
      reason: "Auction not found",
      auctionAddress: addr.toString(),
    });

    return;
  }

  const oldWinner = storage.users.getUser(oldWinnerHashId);
  if (!oldWinner) {
    logger.info("Could not process message", {
      type: "AuctionOutbidded", // todo: enum
      reason: "Old winner not found",
      userIdHash: oldWinnerHashId,
      auctionAddress: addr.toString(),
    });
    return;
  }

  await send(oldWinner.chatId.toFixed(0), `You were outbidded`);

  const newWinner = storage.users.getUser(newWinnerHashId);
  if (!newWinner) {
    logger.info("Could not process message", {
      type: "AuctionOutbidded", // todo: enum
      reason: "New winner not found",
      userIdHash: newWinnerHashId,
      auctionAddress: addr.toString(),
    });
    return;
  }

  await send(oldWinner.chatId.toFixed(0), `Your bid is winning`);
  storage.messages.markNotificationSent(msgHash);

  logger.info("Message processed", {
    type: "AuctionOutbidded", // todo: enum
    auctionAddress: addr.toString(),
  });
};

export const getBatchProcessor = async function* (
  send: SendHandle,
  storage: DAO,
  sk: string,
  network: Network
) {
  const logger = getLogger("processor.process");
  while (true) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));
    const batch = storage.messages.getUnreservedMessageBatch(network.name);

    let messageCount = 0;

    for (const message of batch) {
      const wasReserved = storage.messages.reserve(message.msgHash);
      if (wasReserved === 0) continue;

      // parse message body
      const parser = MESSAGE_PARSERS[message.opcode];
      const parsedMessage = parser(Cell.fromBase64(message.bodyRaw).asSlice());
      const msgH = message.msgHash;
      try {
        switch (parsedMessage.$$type) {
          case "AccountInitialisedEvent":
            await onAccountInitialised(msgH, sk, storage, send, parsedMessage);
            break;
          case "ProfitReceivedEvent":
            await onProfitReceived(msgH, sk, storage, send, parsedMessage);
            break;
          case "AuctionCreatedEvent": {
            await onAuctionCreated(msgH, sk, storage, send, parsedMessage);
            break;
          }
          case "AuctionResolvedEvent": {
            await onAuctionResolved(msgH, sk, storage, send, parsedMessage);
            break;
          }
          case "AuctionOutbiddedEvent": {
            await onAuctionOutbiddedEvent(
              msgH,
              sk,
              storage,
              send,
              parsedMessage
            );
            break;
          }
          default:
            break;
        }
        messageCount += 1;
      } catch (e) {
        if (e instanceof Error) {
          logger.error("Error during message processing", {
            err: e.cause,
            msg: e.message,
            stack: e.stack,
          });
        } else {
          logger.error("Error during message processing", {
            err: "unknown",
            msg: "",
            stack: "",
          });
        }
      }
    }
    logger.info("Batch processed", {
      name: "fetcher",
      messages_count: messageCount,
      network_name: network.name,
    });

    yield;
  }
};
