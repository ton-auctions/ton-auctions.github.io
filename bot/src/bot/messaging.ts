import { Bot, format, InlineKeyboard } from "npm:gramio";

import { DAO } from "../data/dao.ts";
import { sha256 } from "../utils/crypto.ts";
import { Address } from "@ton/core";

export const registerMessaging = (bot: Bot, storage: DAO) => {
  bot.hears(/@bidton_bot messageWinner:(.+?)\s(.*)+/i, async (ctx) => {
    if (!ctx.text) return;
    if (!ctx.args) return;

    let addr;
    try {
      addr = Address.parse(ctx.args[1]);
    } catch {
      await ctx.reply("Auction address is invalid");
      return;
    }

    const message = ctx.args[2];

    const auction = storage.auctions.get(addr);
    if (!auction) {
      await ctx.reply("Auction not found");
      return;
    }

    if (!auction.won) {
      await ctx.reply("Must be winning auction");
      return;
    }

    const userIdHash = await sha256(ctx.from.id);
    if (auction.userIdHash !== userIdHash) {
      await ctx.reply("Permission denied");
      return;
    }

    if (!auction.winnerIdHash) {
      await ctx.reply(
        "No winner attached to auctin (Something is not working right)"
      );
      return;
    }

    const winner = storage.users.getUser(auction.winnerIdHash!);
    if (!winner) {
      await ctx.reply("Winner unrecognised (Something is not working right)");
      return;
    }

    const kb = new InlineKeyboard();
    kb.switchToCurrentChat(
      "Reply",
      `messageOwner:${auction.addr}\nThank's received.`
    );

    // TODO: add confirmation step
    bot.api.sendMessage({
      chat_id: winner.chatId,
      text: format`
      ‼️ YOU HAVE WON: ${auction.name} ‼️
      
      OWNER MESSAGE:
      
      ${message}
      `,
      reply_markup: kb,
    });
  });

  bot.hears(/@bidton_bot messageOwner:(.+?)\s(.*)+/i, async (ctx) => {
    if (!ctx.text) return;
    if (!ctx.args) return;

    let addr;
    try {
      addr = Address.parse(ctx.args[1]);
    } catch {
      await ctx.reply("Auction address is invalid");
      return;
    }

    const message = ctx.args[2];

    const auction = storage.auctions.get(addr);
    if (!auction) {
      await ctx.reply("Auction not found");
      return;
    }

    if (!auction.won) {
      await ctx.reply("Must be winning auction");
      return;
    }

    const userIdHash = await sha256(ctx.from.id);
    if (auction.winnerIdHash !== userIdHash) {
      await ctx.reply("Permission denied");
      return;
    }

    const owner = storage.users.getUser(auction.userIdHash!);
    if (!owner) {
      await ctx.reply("Winner unrecognised (Something is not working right)");
      return;
    }

    const kb = new InlineKeyboard();

    kb.switchToCurrentChat(
      "Reply",
      `messageWinner:${auction.addr}\n <YOUR MESSAGE HERE>`
    );
    kb.text("Disable messaging", `aucdis:${auction.addr.toString()}`);

    // TODO: add confirmation step
    bot.api.sendMessage({
      chat_id: owner.chatId,
      text: format`
      ‼️ WINNER MESSAGE: ${auction.name} ‼️
      
      ${message}
      `,
      reply_markup: kb,
    });
  });
};
