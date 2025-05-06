import { Bot, ChatSenderControlMixin, format, link } from "npm:gramio";

import { DAO } from "../data/dao.ts";
import { sha256 } from "../utils/crypto.ts";
import { UserModel } from "../data/users.ts";

export const registerStart = (bot: Bot, storage: DAO) => {
  bot.command("start", async (ctx) => {
    const userIdHash = await sha256(ctx.from.id);
    const user = storage.users.getUser(userIdHash);

    let updateUser = false;

    if (!user) {
      updateUser = true;
      await ctx.reply(
        "" +
          "🎉 Hey hey! Welcome aboard!\n" +
          "Stoked to have you here!\n" +
          "\n" +
          'To get started, just tap the "Launch Application" button below.\n' +
          "That'll launch the app where you can create your shiny new account. ✨\n" +
          "\n" +
          "Need a hand? I'm just a message away! 🙌\n"
      );
    } else {
      if (user.chatId !== ctx.chat.id) {
        updateUser = true;
        await ctx.reply(
          `Good to have you back. I see you've started new chat. I'll update my records. ${
            user.chatId
          } ${ctx.chat.id.toString()}`
        );
      }
    }

    if (updateUser) {
      storage.users.saveUser({
        userIdHash,
        chatId: ctx.chat.id,
      } as UserModel);
    }
  });
};
