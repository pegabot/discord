/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message } from "discord.js";
import prettyMs from "pretty-ms";
import { BotCommand } from "../../classes/command";

export class UptimeCommand extends BotCommand {
  name = "uptime";
  aliases = ["up"];
  usage = "uptime";
  help = "Wie lange ist der Bot schon aktiv?";
  execute(msg: Message): void {
    msg.channel.send(`**${this.bot.client.user?.username}** ist seit ${prettyMs(this.bot.client.uptime || -1)} aktiv!`);
  }
}
