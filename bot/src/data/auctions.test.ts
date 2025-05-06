import { DAO, getDAO } from "./dao.ts";
import { Address } from "@ton/core";
import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "@std/expect";
import moment from "moment";

describe("Auctions dao", () => {
  let dao: DAO;
  const tomorrow = BigInt(moment().unix() + 26 * 60 * 60);

  beforeEach(async () => {
    dao = await getDAO("./db/testdb.sqlite", true);
  });

  it("Should return undefined if no auction exists for address", () => {
    const auction = dao.auctions.get(
      Address.parse("UQCSBgoQXcdx82WE_OdARpS9mIEDMgGnhpr-hEwO8wf7CCGD")
    );

    expect(auction).toBe(undefined);
  });

  it("Should add auction", () => {
    dao.auctions.add(
      "id_hash",
      Address.parse("UQCSBgoQXcdx82WE_OdARpS9mIEDMgGnhpr-hEwO8wf7CCGD"),
      "Auction",
      tomorrow
    );

    const auction = dao.auctions.get(
      Address.parse("UQCSBgoQXcdx82WE_OdARpS9mIEDMgGnhpr-hEwO8wf7CCGD")
    );

    expect(auction!.addr.toString()).toBe(
      Address.parse(
        "EQCSBgoQXcdx82WE_OdARpS9mIEDMgGnhpr-hEwO8wf7CHxG"
      ).toString()
    );

    expect(auction!).toMatchObject({
      userIdHash: "id_hash",
      name: "Auction",
      endsAt: tomorrow,
      processed: false,
      deleted: false,
      won: false,
      winnerIdHash: null,
    });
  });

  it("Should mark auction as deleted", () => {
    const addr = Address.parse(
      "EQCSBgoQXcdx82WE_OdARpS9mIEDMgGnhpr-hEwO8wf7CHxG"
    );
    dao.auctions.add("id_hash", addr, "Auction", tomorrow);

    dao.auctions.markDeleted(addr);
    {
      const auction = dao.auctions.get(addr);
      expect(auction!).toMatchObject({
        userIdHash: "id_hash",
        name: "Auction",
        endsAt: tomorrow,
        processed: true,
        deleted: true,
        won: false,
        winnerIdHash: null,
      });
    }
  });

  it("Should mark auction as processed", () => {
    const addr = Address.parse(
      "EQCSBgoQXcdx82WE_OdARpS9mIEDMgGnhpr-hEwO8wf7CHxG"
    );
    dao.auctions.add("id_hash", addr, "Auction", tomorrow);

    dao.auctions.markProcessed(addr);
    {
      const auction = dao.auctions.get(addr);
      expect(auction!).toMatchObject({
        userIdHash: "id_hash",
        name: "Auction",
        endsAt: tomorrow,
        processed: true,
        deleted: false,
        won: false,
        winnerIdHash: null,
      });
    }
  });

  it("Should add winner to auction", () => {
    const addr = Address.parse(
      "EQCSBgoQXcdx82WE_OdARpS9mIEDMgGnhpr-hEwO8wf7CHxG"
    );
    dao.auctions.add("id_hash", addr, "Auction", tomorrow);

    dao.auctions.addWinner(addr, "winner_hash");
    {
      const auction = dao.auctions.get(addr);
      expect(auction!).toMatchObject({
        userIdHash: "id_hash",
        endsAt: tomorrow,
        processed: true,
        deleted: false,
        won: true,
        winnerIdHash: "winner_hash",
      });
    }
  });

  it("Should add ", () => {});
});
