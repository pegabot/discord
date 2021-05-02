/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, TextChannel } from "discord.js";
import { Command } from "../../classes/command";
import { BotExecption } from "../../utils/BotExecption";

export class PruneCommand extends Command {
  name = "prune";
  usage = "prune <Anzahl der zu löschenden Nachrichten>";
  help = "Löscht eine gewisse Anzahl an Nachrichten";
  permissions = ["MANAGE_MESSAGES"];

  async execute(msg: Message, args: string[]) {
    if (args[0]) {
      if (isNaN(Number(args[0]))) throw new BotExecption("Dein übergebener Wert ist keine Zahl.");
      if (Number(args[0]) > 50) throw new BotExecption("Ich kann nicht mehr als 50 Nachrichten auf Einmal löschen.");

      const messages = await msg.channel.messages.fetch({ limit: Number(args[0]) + 1 });

      for (const msgToDelete of messages.values()) {
        if (msgToDelete.deletable) {
          msgToDelete.delete();
        } else {
          msg.channel.send(`Die folgende Nachricht konnte von mir nicht gelöscht werden\n>>> ${msgToDelete.content}`);
        }
      }

      return;
    }

    (msg.channel as TextChannel).bulkDelete(args[0] ? Number(args[0]) + 1 : 100);
  }
}
