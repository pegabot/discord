/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../classes/command";

export class NicknameCommand extends Command {
  name = "nickname";
  help = "Mit diesem Command kannst du dir einen Nicknamen setzen";
  usage = ["nick <#name / remove > / nickname <#name / remove>"];
  aliases = ["nick"];
  repeatable = false;

  execute(msg: Message, args: string[]) {
    if (!msg.member) return;

    if (msg.member.hasPermission("ADMINISTRATOR")) return msg.reply("hey! Du bist Admin 😄 deinen Nicknamen kann ich nicht bearbeiten!");

    if (args.length < 1)
      return msg.reply(`du musst einen Nicknamen mit übergeben, mit \`${this.bot.config.prefix}nickname remove\` kannst du deinen Nickname entfernen.`);

    if (args[0] === "remove") {
      msg.member.setNickname("");
      return;
    }

    msg.member.setNickname(args.join(" "), "Pegabot changed the nickname on behalf of this member");
  }
}
