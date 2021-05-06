/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, TextChannel } from "discord.js";
import { Command } from "../../classes/command";
import { CommandExecption } from "../../utils/execptions";

export class PruneCommand extends Command {
  name = "prune";
  usage = "prune <Anzahl der zu löschenden Nachrichten (Dies ist optional, der Standartwert ist 100)>";
  help = "Löscht eine gewisse Anzahl an Nachrichten";
  permissions = ["MANAGE_MESSAGES"];
  repeatable = false;

  async fallbackMethod(msg: Message, numberOfMessageToDelete: number) {
    console.log("Using fallback");

    const messages = await msg.channel.messages.fetch({ limit: numberOfMessageToDelete + 1 });

    for (const msgToDelete of messages.values()) {
      if (msgToDelete.deletable) {
        msgToDelete.delete({ reason: this.bot.client.user?.id });
      } else {
        msg.channel.send(`Die folgende Nachricht konnte von mir nicht gelöscht werden\n>>> ${msgToDelete.content}`);
      }
    }
  }

  async execute(msg: Message, args: string[]) {
    if (args[0]) {
      if (isNaN(Number(args[0]))) throw new CommandExecption("Dein übergebener Wert ist keine Zahl.");
      if (Number(args[0]) > 99) throw new CommandExecption("Ich kann nicht mehr als 99 Nachrichten auf Einmal löschen.");
    }

    const numberOfMessageToDelete = Number(args[0]) || 100;

    try {
      await (msg.channel as TextChannel).bulkDelete(numberOfMessageToDelete + 1);
    } catch (error) {
      this.fallbackMethod(msg, numberOfMessageToDelete);
    }
  }
}
