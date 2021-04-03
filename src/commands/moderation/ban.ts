/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message, MessageCollector, TextChannel } from "discord.js";
import { BotCommand } from "../../classes/command";
import { BotExecption } from "../../utils/BotExecption";
import { resolveUser } from "../../utils/resolveUser";

export class BanCommand extends BotCommand {
  name = "ban";
  usage = "ban <user>";
  help = "Bann einen bestimmten Benutzer";
  permissions = ["BAN_MEMBERS"];

  execute(msg: Message): void {
    const target = msg.mentions.users.first() || msg.author;
    const user = resolveUser(msg, target.username);
    if (!user) throw new BotExecption(`Der Benutzer ${target} wurde nicht gefunden`);

    if (user.id === msg.author.id) throw new BotExecption(`Du kannst dich selbst nicht bannen!`);

    if (user.bannable) {
      msg.channel.send("Was ist der Grund des Bannes?");
      const collector = new MessageCollector(msg.channel as TextChannel, (m) => m.author === msg.author, { max: 1, time: 60000 });
      collector.on("collect", async (m) => {
        await user.ban({ reason: m.content });
        msg.channel.send(`Der Benutzer ${user.user.username} wurde erfolgreich gebannt. Grund: \`${m.content}\``);
        collector.stop();
      });

      collector.on("end", async (collected, reason) => {
        if (reason === "time") {
          msg.channel.send("Das Zeitfenster wurde nicht eingehalten.");
        }
      });
    } else {
      throw new BotExecption("Der Benutzer konnte nicht gebannt werden!");
    }
  }
}
