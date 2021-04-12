/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message, MessageCollector, TextChannel } from "discord.js";
import { Command } from "../../classes/command";
import { BotExecption } from "../../utils/BotExecption";
import { resolveUser } from "../../utils/resolveUser";

export class KickCommand extends Command {
  name = "kick";
  usage = "kick <user>";
  help = "Kickt einen spezifischen Benutzer";
  permissions = ["KICK_MEMBERS"];

  async execute(msg: Message, args: string[]): Promise<void> {
    if (args.length < 1) throw new BotExecption("Ich brauche einen Benutzer zum kicken.");

    const user = resolveUser(msg, args.join(" "));
    if (!user) throw new BotExecption(`Der Benutzer ${args.join(" ")} wurde nicht gefunden.`);
    if (user.id === msg.author.id) throw new BotExecption(`Du kannst dich selbst nicht kicken!`);

    if (user.kickable) {
      msg.channel.send("Was ist der Grund für den Kick?");
      const collector = new MessageCollector(msg.channel as TextChannel, (m) => m.author === msg.author, { max: 1, time: 120000 });
      collector.on("collect", async (m) => {
        await user.kick(m.content);
        msg.channel.send(`Der Benutzer ${user.user.username} wurde erfolgreich gekickt. Grund: \`${m.content}\``);
        collector.stop();
      });

      collector.on("end", async (collected, reason) => {
        if (reason === "time") {
          msg.channel.send("Das Zeitfenster wurde nicht eingehalten.");
        }
      });
    } else {
      throw new BotExecption("Der Benutzer konnte nicht gekickt werden!");
    }
  }
}
