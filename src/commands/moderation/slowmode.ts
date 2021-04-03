/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message, TextChannel } from "discord.js";
import { BotCommand } from "../../classes/command";
import { BotExecption } from "../../utils/BotExecption";

export class SlowmodeCommand extends BotCommand {
  name = "slowmode";
  usage = ["slowmode", "slowmode <Sekunden>"];
  help = "Einstellungen für den Slowmode";
  permissions = ["MANAGE_CHANNELS"];

  async execute(msg: Message, args: string[]): Promise<void> {
    const [input] = args;
    if (!input) {
      msg.channel.send(`Aktuell beträgt die Slowmode Rate ${(msg.channel as TextChannel).rateLimitPerUser} Sekunde(n)`);
    } else {
      if (isNaN(Number(input))) throw new BotExecption("Dein übergebener Wert ist keine Zahl.");
      await (msg.channel as TextChannel).setRateLimitPerUser(Number(input));
      const newChannel = await msg.channel.fetch();
      msg.channel.send(`Die neue Slowmode Rate beträgt nun ${(newChannel as TextChannel).rateLimitPerUser} Sekunde(n)`);
    }
  }
}
