/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { getSystemStatus } from "../../utils/status";

export class SystemStatsCommand extends Command {
  name = "systemstats";
  aliases = ["sysstat"];
  help = "Systeminformationen";
  usage = "systemstats";
  repeatable = false;

  execute(msg: Message) {
    msg.channel.send(getSystemStatus());
  }
}
