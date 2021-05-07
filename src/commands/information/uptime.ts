/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../core/commands/command";
import { getUptime } from "../../utils/uptime";

export class UptimeCommand extends Command {
  name = "uptime";
  aliases = ["up"];
  usage = "uptime";
  help = "Wie lange ist der Bot schon aktiv?";
  repeatable = false;

  execute(msg: Message): void {
    msg.channel.send(`**${this.bot.client.user?.username}** ist seit ${getUptime()} aktiv!`);
  }
}
