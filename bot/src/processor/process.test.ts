import moment from "moment";
import { Address } from "@ton/core";
import { expect } from "jsr:@std/expect";

import { DAO, getDAO } from "../data/dao.ts";
import { Message } from "../fetcher/indexerClient.ts";
import { NETWORKS } from "../fetcher/networks.ts";
import {
  encryptUserId,
  getMessageRequester,
  msgAccountInitialised,
  msgAuctionCreated,
  msgAuctionOutbidded,
  msgAuctionResolved,
  msgProfitReceived,
} from "../fetcher/process.test.ts";

import * as wrappers from "../processor/protocolWrappers.ts";
import { startReadingMessages } from "../fetcher/process.ts";
import { getBatchProcessor } from "./process.ts";
import { PrivateKey, PublicKey } from "eciesjs";
import { sha256 } from "../utils/crypto.ts";

import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { Buffer } from "node:buffer";
import { FakeTime } from "jsr:@std/testing/time";

const user1Account = Address.parse(
  "UQCSBgoQXcdx82WE_OdARpS9mIEDMgGnhpr-hEwO8wf7CCGD"
);

const auctionAddr = Address.parse(
  "EQCn0fhSLevCuUroGvwoCahy5sh7oynFngz0D6TgmwKJk29C"
);

describe("Processor process", () => {
  let sk: PrivateKey;
  let pk: PublicKey;

  let storage: DAO;
  let time: FakeTime;
  let now: number;

  const createReader = (messages: Message[]) => {
    const getReader = (opcode: string) =>
      startReadingMessages(
        NETWORKS.TESTNET,
        opcode,
        getMessageRequester(messages),
        storage
      );

    const its = [
      getReader(wrappers.AccountInitialisedEventOpcode),
      getReader(wrappers.AuctionCreatedEventOpcode),
      getReader(wrappers.AuctionOutbiddedEventOpcode),
      getReader(wrappers.AuctionResolvedEventOpcode),
      getReader(wrappers.ProfitReceivedEventOpcode),
    ];

    return () => Promise.all(its.map((v) => v.next()));
  };

  beforeEach(async () => {
    storage = await getDAO("./db/testdb.sqlite", true);

    try {
      FakeTime.restore();
    } catch {
      // ignore
    }

    time = new FakeTime(new Date("2023-05-01T12:00:00Z"));
    now = moment().unix();
    sk = new PrivateKey();
    pk = sk.publicKey;
  });

  it("Should process AccountInitialised", async () => {
    storage.users.saveUser({
      chatId: 100,
      userIdHash: await sha256(5000),
    });

    const messages: Message[] = [
      await msgAccountInitialised(
        now,
        user1Account,
        encryptUserId(pk.toBytes(), 5000)
      ),
    ];

    const read = startReadingMessages(
      NETWORKS.TESTNET,
      wrappers.AccountInitialisedEventOpcode,
      getMessageRequester(messages),
      storage
    );
    await read.next();

    const process = getBatchProcessor(
      async () => {},
      storage,
      sk.toHex(),
      NETWORKS.TESTNET
    );
    await process.next();

    const user = storage.users.getUserForAccount(user1Account);

    expect(user!).toMatchObject({
      chatId: 100,
      userIdHash: await sha256(5000),
    });
  });

  it("Test AccountInitialised message when user exist", async () => {
    storage.users.saveUser({
      chatId: 100,
      userIdHash: await sha256(5000),
    });

    const messages: Message[] = [
      await msgAccountInitialised(
        now,
        user1Account,
        encryptUserId(pk.toBytes(), 5000)
      ),
    ];

    const read = startReadingMessages(
      NETWORKS.TESTNET,
      wrappers.AccountInitialisedEventOpcode,
      getMessageRequester(messages),
      storage
    );
    await read.next();

    const process = getBatchProcessor(
      async () => {},
      storage,
      sk.toHex(),
      NETWORKS.TESTNET
    );
    await process.next();

    const user = storage.users.getUserForAccount(user1Account);

    expect(user!).toMatchObject({
      chatId: 100,
      userIdHash: await sha256(5000),
    });

    const msg = storage.messages.getMessage(messages[0].hash);

    expect(msg.reserveCount).toBe(1n);
    expect(msg.reservedForSendingAt!).toBeGreaterThan(0);
    expect(msg.notificationSentAt!).toBeGreaterThan(0);
  });

  it("Should process AccountInitialised when user not exist", async () => {
    const messages: Message[] = [
      await msgAccountInitialised(
        now,
        user1Account,
        encryptUserId(pk.toBytes(), 5000)
      ),
    ];

    const read = startReadingMessages(
      NETWORKS.TESTNET,
      wrappers.AccountInitialisedEventOpcode,
      getMessageRequester(messages),
      storage
    );
    await read.next();

    const process = getBatchProcessor(
      async () => {},
      storage,
      sk.toHex(),
      NETWORKS.TESTNET
    );
    process.next();

    const user = storage.users.getUserForAccount(user1Account);
    expect(user).toBeUndefined();

    const msg = storage.messages.getMessage(messages[0].hash);

    expect(msg.reserveCount).toBe(1n);
    expect(msg.reservedForSendingAt!).toBeGreaterThan(0);
    expect(msg.notificationSentAt!).toBeNull();
  });

  it("Should abandon processing AccountInitialised after 10 reserves", async () => {
    const messages: Message[] = [
      await msgAccountInitialised(
        now,
        user1Account,
        Buffer.from([1, 2, 3, 4, 5])
      ),
      await msgAccountInitialised(
        now,
        user1Account,
        encryptUserId(pk.toBytes(), 5000)
      ),
    ];
    const read = startReadingMessages(
      NETWORKS.TESTNET,
      wrappers.AccountInitialisedEventOpcode,
      getMessageRequester(messages),
      storage
    );
    await read.next();
    const process = getBatchProcessor(
      async () => {},
      storage,
      sk.toHex(),
      NETWORKS.TESTNET
    );
    for (let i = 1; i <= 10; i++) {
      await process.next();
      expect(storage.messages.getCount()).toBe(2n);
      const msg = storage.messages.getMessage(messages[0].hash);
      time.tick(60 * 15);
      expect(msg.reserveCount).toBe(1n);
    }
    {
      time.tick(60 * 15 * 1000);
      await process.next();
      const msg = storage.messages.getMessage(messages[0].hash);
      expect(msg.reserveCount).toBe(2n);
      time.tick((60 * 15 + 1) * 1000);
    }
    {
      await process.next();
      const msg = storage.messages.getMessage(messages[0].hash);
      expect(msg.reserveCount).toBe(3n);
      time.tick((60 * 15 + 1) * 1000);
    }
    await process.next();
    time.tick((60 * 15 + 1) * 1000);
    await process.next();
    time.tick((60 * 15 + 1) * 1000);
    await process.next();
    time.tick((60 * 15 + 1) * 1000);
    await process.next();
    time.tick((60 * 15 + 1) * 1000);
    await process.next();
    time.tick((60 * 15 + 1) * 1000);
    await process.next();
    time.tick((60 * 15 + 1) * 1000);
    {
      await process.next();
      const msg = storage.messages.getMessage(messages[0].hash);
      expect(msg.reserveCount).toBe(10n);
      time.tick((60 * 15 + 1) * 1000);
    }
    {
      await process.next();
      const msg = storage.messages.getMessage(messages[0].hash);
      expect(msg.reserveCount).toBe(10n);
      time.tick((60 * 15 + 1) * 1000);
    }
    {
      await process.next();
      const msg = storage.messages.getMessage(messages[0].hash);
      expect(msg.reserveCount).toBe(10n);
    }
  });

  it("Should process AuctionCreatedEvent", async () => {
    storage.users.saveUser({
      chatId: 100,
      userIdHash: await sha256(5000),
    });

    const messages: Message[] = [
      await msgAccountInitialised(
        now,
        user1Account,
        encryptUserId(pk.toBytes(), 5000)
      ),
      await msgAuctionCreated(
        now + 1,
        auctionAddr,
        BigInt(moment().unix() + 24 * 60 * 60),
        encryptUserId(pk.toBytes(), 5000)
      ),
    ];

    const read = createReader(messages);
    await read();

    expect(storage.messages.getCount()).toBe(2n);

    const process = getBatchProcessor(
      async () => {},
      storage,
      sk.toHex(),
      NETWORKS.TESTNET
    );
    await process.next();

    expect(storage.auctions.getCount()).toBe(1n);

    const auction = storage.auctions.get(auctionAddr);
    expect(auction).not.toBeUndefined();
    expect(auction!.deleted).toBe(false);
    expect(auction!.processed).toBe(false);
    expect(auction!.userIdHash).toBe(await sha256(5000));
    expect(auction!.winnerIdHash).toBeNull();
    expect(auction!.won).toBe(false);
  });

  it("Should process AuctionCreatedEvent on delete", async () => {
    storage.users.saveUser({
      chatId: 100,
      userIdHash: await sha256(5000),
    });

    const messages: Message[] = [
      await msgAccountInitialised(
        now,
        user1Account,
        encryptUserId(pk.toBytes(), 5000)
      ),
      await msgAuctionCreated(
        now + 1,
        auctionAddr,
        BigInt(moment().unix() + 24 * 60 * 60),
        encryptUserId(pk.toBytes(), 5000)
      ),
      await msgAuctionResolved(
        now + 2,
        auctionAddr,
        encryptUserId(pk.toBytes(), 5000)
      ),
    ];

    const read = createReader(messages);
    await read();

    expect(storage.messages.getCount()).toBe(3n);

    const process = getBatchProcessor(
      async () => {},
      storage,
      sk.toHex(),
      NETWORKS.TESTNET
    );
    await process.next();

    expect(storage.auctions.getCount()).toBe(1n);

    const auction = storage.auctions.get(auctionAddr);
    expect(auction).not.toBeUndefined();
    expect(auction!.deleted).toBe(true);
    expect(auction!.processed).toBe(true);
    expect(auction!.userIdHash).toBe(await sha256(5000));
    expect(auction!.winnerIdHash).toBeNull();
    expect(auction!.won).toBe(false);
  });

  it("Should process AuctionCreatedEvent on win", async () => {
    const userIdHash = await sha256(5000);
    // user
    storage.users.saveUser({
      chatId: 100,
      userIdHash: userIdHash,
    });

    const winnerIdHash = await sha256(6000);
    // winner
    storage.users.saveUser({
      chatId: 100,
      userIdHash: winnerIdHash,
    });

    const messages: Message[] = [
      await msgAccountInitialised(
        now,
        user1Account,
        encryptUserId(pk.toBytes(), 5000)
      ),
      await msgAuctionCreated(
        now + 1,
        auctionAddr,
        BigInt(moment().unix() + 24 * 60 * 60),
        encryptUserId(pk.toBytes(), 5000)
      ),
      await msgAuctionResolved(
        now + 2,
        auctionAddr,
        encryptUserId(pk.toBytes(), 5000),
        encryptUserId(pk.toBytes(), 6000)
      ),
    ];

    const read = createReader(messages);
    await read();

    expect(storage.messages.getCount()).toBe(3n);

    const process = getBatchProcessor(
      async () => {},
      storage,
      sk.toHex(),
      NETWORKS.TESTNET
    );
    await process.next();

    expect(storage.auctions.getCount()).toBe(1n);

    const auction = storage.auctions.get(auctionAddr);
    expect(auction).not.toBeUndefined();
    expect(auction!.deleted).toBe(false);
    expect(auction!.processed).toBe(true);
    expect(auction!.userIdHash).toBe(await sha256(5000));
    expect(auction!.winnerIdHash).toBe(await sha256(6000));
    expect(auction!.won).toBe(true);
  });

  it("Should process AuctionOutbidded event", async () => {
    const userIdHash = await sha256(5000);
    // user
    storage.users.saveUser({
      chatId: 100,
      userIdHash: userIdHash,
    });

    const bidder1IdHash = await sha256(6000);
    // bidder1
    storage.users.saveUser({
      chatId: 100,
      userIdHash: bidder1IdHash,
    });

    const bidder2IdHash = await sha256(7000);
    // bidder2
    storage.users.saveUser({
      chatId: 100,
      userIdHash: bidder2IdHash,
    });

    const messages: Message[] = [
      await msgAccountInitialised(
        now,
        user1Account,
        encryptUserId(pk.toBytes(), 5000)
      ),
      await msgAuctionCreated(
        now + 1,
        auctionAddr,
        BigInt(moment().unix() + 24 * 60 * 60),
        encryptUserId(pk.toBytes(), 5000)
      ),
      await msgAuctionOutbidded(
        now + 2,
        auctionAddr,
        10000n,
        encryptUserId(pk.toBytes(), 6000),
        encryptUserId(pk.toBytes(), 7000)
      ),
    ];

    const read = createReader(messages);
    await read();

    expect(storage.messages.getCount()).toBe(3n);

    const process = getBatchProcessor(
      async () => {},
      storage,
      sk.toHex(),
      NETWORKS.TESTNET
    );
    await process.next();

    expect(storage.auctions.getCount()).toBe(1n);

    const auction = storage.auctions.get(auctionAddr);
    expect(auction).not.toBeUndefined();
    expect(auction!.deleted).toBe(false);
    expect(auction!.processed).toBe(false);
    expect(auction!.userIdHash).toBe(await sha256(5000));
    expect(auction!.winnerIdHash).toBeNull();
    expect(auction!.won).toBe(false);
  });

  it("Should process ProfitReceived event", async () => {
    const userIdHash = await sha256(5000);
    // user
    storage.users.saveUser({
      chatId: 100,
      userIdHash: userIdHash,
    });

    const messages: Message[] = [
      await msgProfitReceived(
        now,
        user1Account,
        10000n,
        encryptUserId(pk.toBytes(), 5000)
      ),
    ];

    const read = createReader(messages);
    await read();

    expect(storage.messages.getCount()).toBe(1n);

    let called = false;
    const process = getBatchProcessor(
      () => {
        called = true;
        return new Promise((r) => r());
      },
      storage,
      sk.toHex(),
      NETWORKS.TESTNET
    );
    await process.next();

    expect(called).toBe(true);
  });
});
