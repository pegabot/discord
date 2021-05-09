/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction } from "discord.js";
import { version } from "../constants/version";
import { InteractionCommand } from "../core/interactions/interactionCommand";
import { versionGitHubLink } from "../utils/version";

export class VersionInteraction extends InteractionCommand {
  name = "version";
  description = "Welche Version läuft gerade?";

  execute(interaction: CommandInteraction) {
    interaction.reply(`die aktuelle Version ist: \`${version}\` (${versionGitHubLink(version)})`);
  }
}
