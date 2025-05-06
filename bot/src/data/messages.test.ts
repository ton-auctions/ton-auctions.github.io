import { DAO, getDAO } from "./dao.ts";
import { FakeTime } from "jsr:@std/testing/time";
import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "@std/expect/expect";
import moment from "moment";

describe("Messages DAO", () => {
  let dao: DAO;
  const now = BigInt(moment().unix())
  const network = "testnet";

  beforeEach(async () => {
    dao = await getDAO("./db/testdb.sqlite", true);
  })

  it("Should give empty batch if no messages exist", () => {
    const batch = dao.messages.getUnreservedMessageBatch(network);
    expect(batch.length).toBe(0);
  }); 

  it("Should reserve 2 batches in 2 passes", () => {
    const count = 20;

    for (let i = 0; i < count; i++) {
      dao.messages.addMessage({
        bodyRaw: `${i}`,
        msgHash: `${i}`,
        createdLt: now,
        network: network,
        opcode: "someopcode",
        notificationSentAt: null,
        reservedForSendingAt: null,
        reserveCount: 0,
      });
    }
  
    expect(dao.messages.getCount()).toBe(BigInt(count));
  
    const seen = new Set();
  
    const batch = dao.messages.getUnreservedMessageBatch(network);
    let i = 0;
    for (const message of batch) {
      expect(seen).not.toContain(message.msgHash);
      seen.add(message.msgHash);
      expect(message.msgHash, "10");
      i++;
    }
  
    // Ok, now reserve
    for (const message of dao.messages.getUnreservedMessageBatch(network)) {
      dao.messages.reserve(message.msgHash);
      i++;
    }
  
    // Next batch with reserve
    for (const message of dao.messages.getUnreservedMessageBatch(network)) {
      expect(seen).not.toContain(message.msgHash);
      seen.add(message.msgHash);
      expect(message.msgHash, "20");
      dao.messages.reserve(message.msgHash);
    }
  })

  it("Should allow to reserve message after timeout", () => {
    using time = new FakeTime();
  
    const now = BigInt(moment().unix())
  
    dao.messages.addMessage({
      bodyRaw: `body`,
      msgHash: `hash`,
      createdLt: now,
      network: "testnet",
      opcode: "someopcode",
      reserveCount: 0,
      notificationSentAt: null,
      reservedForSendingAt: null,
    });
  
    {
      const batch = dao.messages.getUnreservedMessageBatch(network);
      expect(batch.length).toBe(1);
      dao.messages.reserve(batch[0].msgHash);
    }
  
    {
      const batch = dao.messages.getUnreservedMessageBatch(network);
      expect(batch.length).toBe(0);
    }
  
    time.tick(901*1000)
  
    {
      const batch = dao.messages.getUnreservedMessageBatch(network);
      expect(batch.length).toBe(1);
      expect(batch[0].reserveCount).toBe(1n);
    }
  })

  it("Should return 0 for non existent opcode", () => {
    // TODO: highly debatable.
    expect(dao.messages.getLastSeenLtForOpcode("test", "op1")).toBe(0);
  })

  it("Should update last_seen_lt value and reeturn on request", () => {
    dao.messages.registerOpcode("test", "op1");

    const lastSeen1 = dao.messages.getLastSeenLtForOpcode("test", "op1")
    expect(lastSeen1).toBe(0n);
  
    dao.messages.updateLastSeenLtForOpcode(20n, "test", "op1");
  
    const lastSeen2 = dao.messages.getLastSeenLtForOpcode("test", "op1")
    expect(lastSeen2).toBe(20n);
  
    dao.messages.updateLastSeenLtForOpcode(40n, "test", "op1");
  
    const lastSeen3 = dao.messages.getLastSeenLtForOpcode("test", "op1")
    expect(lastSeen3).toBe(40n);
  })
})
