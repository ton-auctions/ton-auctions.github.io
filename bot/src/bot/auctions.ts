import {
  Bot,
  format as fmt,
  link,
  join,
  bold,
  InlineKeyboard,
} from "npm:gramio";

import { DAO } from "../data/dao.ts";
import { sha256 } from "../utils/crypto.ts";
import { Address } from "@ton/core";
import moment from "moment";
import { Auction } from "../data/auctions.ts";

const APP_URL = Deno.env.get("APP_URL");

const formatAuction = (a: Auction) => {
  const secondsDiff = Number(a.endsAt) - moment().unix();
  const duration = moment.duration(secondsDiff, "seconds");

  const daysTillEnd = Math.floor(duration.asDays());
  const hoursTillEnd = Math.floor(duration.asHours() % 24);
  const minutesTillEnd = Math.floor(duration.asMinutes() % 60);

  if (duration.seconds() < 0) {
    if (a.won) {
      return fmt`👌 ${a.name} 👌
        ⏳ Ends In : ${bold("Ended. Profit collected.")}
        📍 ${link("Web", `${APP_URL}/auction/${a.addr}`)}\n`;
    } else {
      return fmt`‼️ ${a.name} ‼️
        ⏳ Ends In : ${bold("Ended. You can collect profit now.")}
        📍 ${link("Web", `${APP_URL}/auction/${a.addr}`)}\n`;
    }
  }
  const endsInString =
    daysTillEnd > 0
      ? `${daysTillEnd} days ${hoursTillEnd} hours`
      : `${hoursTillEnd} hours ${minutesTillEnd} minutes`;

  return fmt`🎰 ${a.name}
    ⏳ Ends In : ${endsInString}
    📍 ${link("Web", `${APP_URL}/auction/${a.addr}`)}\n`;
};

export const registerAuctions = (bot: Bot, storage: DAO) => {
  bot.command("won_auctions", async (context) => {
    if (!context.text) return;

    const userIdHash = await sha256(context.from.id);
    const auctions = storage.auctions.getWonAuctions(userIdHash);

    if (auctions.length === 0) {
      await context.reply("No active auctions found.");
      return;
    }

    const inlineKeyboard = new InlineKeyboard().columns(1);

    for (const a of auctions) {
      inlineKeyboard.text(`View ${a.name}`, `auction:${a.addr.toString()}`);
    }

    const auctionsStr = join(auctions, formatAuction, "\n");
    await context.reply(auctionsStr, {
      reply_markup: inlineKeyboard,
    });
  });

  bot.command("auctions", async (context) => {
    if (!context.text) return;

    const userIdHash = await sha256(context.from.id);
    const auctions = storage.auctions.getUserAuctions(userIdHash);

    if (auctions.length === 0) {
      await context.reply("No active auctions found.");
      return;
    }

    const inlineKeyboard = new InlineKeyboard().columns(1);

    for (const a of auctions) {
      inlineKeyboard.text(`View ${a.name}`, `auction:${a.addr.toString()}`);
    }

    const auctionsStr = join(auctions, formatAuction, "\n");
    await context.reply(auctionsStr, {
      reply_markup: inlineKeyboard,
    });
  });

  // Handle auction select
  bot.callbackQuery(/auction:(.+)/, async (ctx) => {
    const payload = ctx.queryPayload as string;
    const addr = Address.parse(payload.split(":")[1]);
    const userIdHash = await sha256(ctx.from.id);

    const auction = storage.auctions.get(addr);

    if (!auction) {
      await ctx.answerCallbackQuery("Auction not found");
      return;
    }

    if (
      auction.userIdHash != userIdHash &&
      auction.winnerIdHash != userIdHash
    ) {
      await ctx.answerCallbackQuery("Permission denied");
      return;
    }

    await ctx.editText(formatAuction(auction));

    const inlineKeyboard = new InlineKeyboard()
      .columns(1)
      .webApp("Open in MiniApp", `${APP_URL}/auction/${auction.addr}`);

    if (auction.won && auction.userIdHash == userIdHash) {
      inlineKeyboard.switchToCurrentChat(
        "Send Message To Winner",
        `messageWinner:${auction.addr}\nCograts you have won, here is the link to a prize: <insert link here>`
      );
    }

    if (auction.won && auction.winnerIdHash == userIdHash) {
      inlineKeyboard.switchToCurrentChat(
        "Send Message To Owner",
        `messageWinner:${auction.addr}\nCograts you have won, here is the link to a prize: <insert link here>`
      );
    }

    await ctx.editReplyMarkup(inlineKeyboard);
  });

  bot.callbackQuery(/aucdis:(.+)/, async (ctx) => {
    const payload = ctx.queryPayload as string;
    const addr = Address.parse(payload.split(":")[1]);
    const userIdHash = await sha256(ctx.from.id);

    const auction = storage.auctions.get(addr);

    if (!auction) {
      await ctx.answerCallbackQuery("Auction not found");
      return;
    }

    if (auction.userIdHash != userIdHash) {
      await ctx.answerCallbackQuery("Permission denied");
      return;
    }

    await ctx.editText(formatAuction(auction));

    const inlineKeyboard = new InlineKeyboard()
      .columns(1)
      .webApp("Open in MiniApp", `${APP_URL}/auction/${auction.addr}`);

    if (auction.won) {
      inlineKeyboard.switchToCurrentChat(
        "Send Message To Winner",
        `messageWinner:${auction.addr}\nCograts you have won, here is the link to a prize: <insert link here>`
      );
    }

    await ctx.editReplyMarkup(inlineKeyboard);
  });
};
