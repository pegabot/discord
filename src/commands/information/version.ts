/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { version } from "../../constants/version";
import { versionGitHubLink } from "../../utils/version";

export class VersionCommand extends Command {
  name = "Version";
  help = "Zeigt die aktuelle Botversion an.";
  usage = "version";
  async execute(msg: Message): Promise<void> {
    msg.reply(`die aktuelle Version ist: \`${version}\` (${versionGitHubLink(version)})`);
  }
}
