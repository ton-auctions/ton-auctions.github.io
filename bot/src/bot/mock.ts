import { Bot } from "npm:gramio";
import { Address } from "@ton/core";

import { DAO } from "../data/dao.ts";
import { UserModel } from "../data/users.ts";
import { Auction } from "../data/auctions.ts";
import { sha256 } from "../utils/crypto.ts";

export const registerMock = (bot: Bot, storage: DAO) => {
  bot.command("mock", async (ctx) => {
    const userIdHash = await sha256(ctx.from.id);
    const user = {
      chatId: ctx.chat.id,
      userIdHash: userIdHash,
    } as UserModel;

    storage.users.saveUser(user);

    // Generate mock auctions
    const now = BigInt(Math.floor(Date.now() / 1000));
    const mockAuctions: Auction[] = [
      {
        name: "Active Auction #1",
        endsAt: now + BigInt(86400), // 1 day from now
        won: false,
        processed: false,
        deleted: false,
        addr: Address.parse("UQA3diOgTs3Hv_DuG6wj8j_CcA_12FKI6fbueptCPQ93Du0B"),
        userIdHash: userIdHash,
        winnerIdHash: null,
        awaitsMessage: false,
      },
      {
        name: "Won Auction #2",
        endsAt: now - BigInt(3600), // 1 hour ago
        won: true,
        processed: true,
        deleted: false,
        addr: Address.parse("EQAdIe35PY12j5Y_bU-2z5uWjCNV2CyCRCYifVKQExuQT28M"),
        userIdHash: userIdHash,
        winnerIdHash: null,
        awaitsMessage: false,
      },
      {
        name: "Deleted Auction #3",
        endsAt: now - BigInt(7200), // 2 hours ago
        won: false,
        processed: true,
        deleted: true,
        addr: Address.parse("EQD6k1571PXeTwRzOtU_SDgmepcLbvRexFcDoOpSbEgVZ69D"),
        userIdHash: userIdHash,
        winnerIdHash: null,
        awaitsMessage: false,
      },
      {
        name: "Ended Auction #4",
        endsAt: now - BigInt(1800), // 30 mins ago
        won: false,
        processed: false,
        deleted: false,
        addr: Address.parse("UQDYhTBQqkqAbZQjYxhQicUqM8nt2WCaUg4PhxUuAEi1nqME"),
        userIdHash: userIdHash,
        winnerIdHash: null,
        awaitsMessage: false,
      },
    ];

    for (const mock of mockAuctions) {
      storage.auctions.add(mock.userIdHash, mock.addr, mock.name, mock.endsAt);

      if (mock.won) {
        storage.auctions.addWinner(mock.addr, userIdHash);
      }
      if (mock.processed) {
        storage.auctions.markProcessed(mock.addr);
      }
      if (mock.deleted) {
        storage.auctions.markDeleted(mock.addr);
      }
    }

    await ctx.reply(`Done.`);
  });
};
