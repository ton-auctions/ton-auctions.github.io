import { Address, beginCell } from "@ton/core";
import { Message } from "./indexerClient.ts";
import { NETWORKS } from "./networks.ts";
import { getBatchFetcher, startReadingMessages } from "./process.ts";
import * as wrappers from "../processor/protocolWrappers.ts";
import moment from "moment";
import { DAO, getDAO } from "../data/dao.ts";
import { sha256 } from "../utils/crypto.ts";
import { encrypt, PrivateKey } from "eciesjs";

import { Buffer } from "node:buffer";
import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "@std/expect";

export const encryptUserId = (pk: Uint8Array, userId: number) => {
  let hexString = userId.toString(16);
  // NOTE: AES gsm requires message to be multiple of 2 bytes. Thus pad with zero
  if (hexString.length % 2 === 1) {
    hexString = `0${hexString}`;
  }
  const buffer = Buffer.from(hexString, "hex");

  return encrypt(pk, buffer);
};

export const msgAccountInitialised = async (
  created_lt: number,
  addr: Address,
  encryptedUserId: Buffer = Buffer.from([])
) => {
  const builder = wrappers.storeAccountInitialisedEvent({
    $$type: "AccountInitialisedEvent",
    address: addr,
    secret_id: beginCell().storeBuffer(encryptedUserId).endCell(),
  });

  const cell = beginCell();
  builder(cell);
  const body = cell.asCell().toBoc().toString("base64");

  return {
    hash: await sha256(body + created_lt.toFixed(0)),
    created_lt: created_lt.toFixed(0),
    message_content: { body: body },
    opcode: wrappers.AccountInitialisedEventOpcode,
    source: "some source",
  };
};

export const msgProfitReceived = async (
  created_lt: number,
  addr: Address,
  amount: bigint = 1000000000n,
  encryptedUserId: Buffer = Buffer.from([])
) => {
  const builder = wrappers.storeProfitReceivedEvent({
    $$type: "ProfitReceivedEvent",
    address: addr,
    secret_id: beginCell().storeBuffer(encryptedUserId).endCell(),
    amount: amount,
  });

  const cell = beginCell();
  builder(cell);
  const body = cell.asCell().toBoc().toString("base64");

  return {
    hash: await sha256(body + created_lt.toFixed(0)),
    created_lt: created_lt.toFixed(0),
    message_content: { body: body },
    opcode: wrappers.ProfitReceivedEventOpcode,
    source: "some source",
  };
};

export const msgAuctionCreated = async (
  created_lt: number,
  addr: Address,
  ends_at: bigint,
  encryptedUserId: Buffer = Buffer.from([])
) => {
  const builder = wrappers.storeAuctionCreatedEvent({
    $$type: "AuctionCreatedEvent",
    address: addr,
    owner_secret_id: beginCell().storeBuffer(encryptedUserId).endCell(),
    name: "Some auction",
    ends_at: ends_at,
  });

  const cell = beginCell();
  builder(cell);
  const body = cell.asCell().toBoc().toString("base64");

  return {
    hash: await sha256(body + created_lt.toFixed(0)),
    created_lt: created_lt.toFixed(0),
    message_content: { body: body },
    opcode: wrappers.AuctionCreatedEventOpcode,
    source: "some source",
  };
};

export const msgAuctionOutbidded = async (
  created_lt: number,
  addr: Address,
  amount: bigint,
  encryptedNewWinnerId: Buffer = Buffer.from([]),
  encryptedOldWinnerId: Buffer = Buffer.from([])
) => {
  const builder = wrappers.storeAuctionOutbiddedEvent({
    $$type: "AuctionOutbiddedEvent",
    new_winner_secret_id: beginCell()
      .storeBuffer(encryptedNewWinnerId)
      .endCell(),
    old_winner_secret_id: beginCell()
      .storeBuffer(encryptedOldWinnerId)
      .endCell(),
    address: addr,
    amount: amount,
    owner_secret_id: beginCell().storeInt(1n, 100).endCell(),
  });

  const cell = beginCell();
  builder(cell);
  const body = cell.asCell().toBoc().toString("base64");

  return {
    hash: await sha256(body + created_lt.toFixed(0)),
    created_lt: created_lt.toFixed(0),
    message_content: { body: body },
    opcode: wrappers.AuctionOutbiddedEventOpcode,
    source: "some source",
  };
};

export const msgAuctionResolved = async (
  created_lt: number,
  addr: Address,
  encryptedOwnerId: Buffer,
  encryptedWinnerId: Buffer | null = null
) => {
  const builder = wrappers.storeAuctionResolvedEvent({
    $$type: "AuctionResolvedEvent",
    winner_secret_id:
      encryptedWinnerId == null
        ? null
        : beginCell().storeBuffer(encryptedWinnerId).endCell(),
    address: addr,
    owner_secret_id: beginCell().storeBuffer(encryptedOwnerId).endCell(),
  });

  const cell = beginCell();
  builder(cell);
  const body = cell.asCell().toBoc().toString("base64");

  return {
    hash: await sha256(body + created_lt.toFixed(0)),
    created_lt: created_lt.toFixed(),
    message_content: { body: body },
    opcode: wrappers.AuctionResolvedEventOpcode,
    source: "some source",
  };
};

const user1_addr = Address.parse(
  "UQCSBgoQXcdx82WE_OdARpS9mIEDMgGnhpr-hEwO8wf7CCGD"
);

const auction1_addr = Address.parse(
  "UQCSBgoQXcdx82WE_OdARpS9mIEDMgGnhpr-hEwO8wf7CCGD"
);

export const getMessageRequester = (
  messages: Message[],
  batchSize: number = 2
) => {
  return async function* (opcode: string, last_seen_lt: bigint) {
    let localIdx = 0;
    for (const msg of messages) {
      if (localIdx == batchSize) break;
      if (msg.opcode != opcode) continue;
      if (BigInt(msg.created_lt) <= last_seen_lt) continue;

      yield msg;

      localIdx += 1;
    }
  };
};

export const exitAfter = (n: number) => {
  let count = 0;

  return () => {
    count += 1;
    return count > n;
  };
};

describe("Fetcher process", () => {
  let storage: DAO;
  let now: number;

  beforeEach(async () => {
    storage = await getDAO("./db/testdb.sqlite", true);
    now = moment().unix();
  });

  it("Should test message provision", async () => {
    const messages: Message[] = [
      await msgAccountInitialised(now, user1_addr),
      // 4 other
      await msgAuctionCreated(now, auction1_addr, 666n),
      await msgAuctionOutbidded(now, auction1_addr, 100000n),
      await msgAuctionResolved(now, auction1_addr, Buffer.from([])),
      await msgProfitReceived(now, user1_addr, 100n),
      // 1 good
      await msgAccountInitialised(now + 10, user1_addr),
      // other
      await msgAuctionCreated(now, auction1_addr, 666n),
      await msgAuctionOutbidded(now, auction1_addr, 100000n),
      await msgAuctionResolved(now, auction1_addr, Buffer.from([])),
      await msgProfitReceived(now, user1_addr, 100n),
      // batch end
      await msgAccountInitialised(now + 30, user1_addr),
    ];

    const reader = startReadingMessages(
      NETWORKS.TESTNET,
      wrappers.AccountInitialisedEventOpcode,
      getMessageRequester(messages),
      storage
    );
    await reader.next();

    expect(storage.messages.getCount()).toBe(2n);

    const unreservedMessages = storage.messages.getUnreservedMessageBatch(
      NETWORKS.TESTNET.name
    );

    expect(unreservedMessages[0]).toMatchObject({
      bodyRaw: messages[0].message_content.body,
      createdLt: BigInt(messages[0].created_lt),
      msgHash: messages[0].hash,
      reserveCount: 0n,
      network: NETWORKS.TESTNET.name,
      opcode: messages[0].opcode,
    });

    expect(unreservedMessages[1]).toMatchObject({
      bodyRaw: messages[5].message_content.body,
      createdLt: BigInt(messages[5].created_lt),
      msgHash: messages[5].hash,
      reserveCount: 0n,
      network: NETWORKS.TESTNET.name,
      opcode: messages[5].opcode,
    });

    await reader.next();

    expect(storage.messages.getCount()).toBe(3n);
  });

  it("Should test duplicate hash avoidance", async () => {
    const sk = new PrivateKey();

    const now = moment().unix();

    const encryptedUserId = encryptUserId(sk.publicKey.toBytes(), 5000);

    const messages: Message[] = [
      await msgAccountInitialised(now, user1_addr, encryptedUserId),
      await msgAccountInitialised(now, user1_addr, encryptedUserId),
      await msgAccountInitialised(now, user1_addr, encryptedUserId),
      await msgAccountInitialised(now, user1_addr, encryptedUserId),
    ];

    const reader = startReadingMessages(
      NETWORKS.TESTNET,
      wrappers.AccountInitialisedEventOpcode,
      getMessageRequester(messages),
      storage
    );

    await reader.next();

    expect(storage.messages.getCount()).toBe(1n);
  });

  it("Should test multiple coroutines processing", async () => {
    const messages: Message[] = [
      await msgAccountInitialised(now, user1_addr),
      // 4 other
      await msgAuctionCreated(now + 1, auction1_addr, 666n),
      await msgAuctionOutbidded(now + 2, auction1_addr, 100000n),
      await msgAuctionResolved(now + 3, auction1_addr, Buffer.from([])),
      await msgProfitReceived(now + 4, user1_addr, 100n),
      // 1 good
      await msgAccountInitialised(now + 10, user1_addr),
      // other
      await msgAuctionCreated(now + 5, auction1_addr, 666n),
      await msgAuctionOutbidded(now + 6, auction1_addr, 100000n),
      await msgAuctionResolved(now + 7, auction1_addr, Buffer.from([])),
      await msgProfitReceived(now + 8, user1_addr, 100n),
      // batch end
      await msgAccountInitialised(now + 30, user1_addr),
    ];

    const fetcher = getBatchFetcher(
      NETWORKS.TESTNET,
      getMessageRequester(messages),
      storage
    );

    await fetcher();
    expect(storage.messages.getCount()).toBe(10n);

    await fetcher();
    expect(storage.messages.getCount()).toBe(11n);
  });
});
