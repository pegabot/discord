/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, MessageCollector, TextChannel } from "discord.js";
import { Command } from "../../core/commands/command";
import { CommandExecption } from "../../utils/execptions";
import { resolveUser } from "../../utils/resolveUser";

export class KickCommand extends Command {
  name = "kick";
  usage = "kick <user>";
  help = "Kickt einen spezifischen Benutzer";
  permissions = ["KICK_MEMBERS"];
  repeatable = false;

  async execute(msg: Message, args: string[]) {
    if (args.length < 1) throw new CommandExecption("Ich brauche einen Benutzer zum kicken.");

    const user = resolveUser(msg, args.join(" "));
    if (!user) throw new CommandExecption(`Der Benutzer ${args.join(" ")} wurde nicht gefunden.`);
    if (user.id === msg.author.id) throw new CommandExecption(`Du kannst dich selbst nicht kicken!`);

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
      throw new CommandExecption("Der Benutzer konnte nicht gekickt werden!");
    }
  }
}
