/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { version } from "../../utils/version";

export class VersionCommand extends Command {
  name = "Version";
  help = "Zeigt die aktuelle Botversion an.";
  usage = "version";
  async execute(msg: Message): Promise<void> {
    msg.reply(`die aktuelle Version ist: \`${version}\` (https://github.com/pegabot/discord/releases/tag/${version})`);
  }
}
