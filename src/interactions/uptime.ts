/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction } from "discord.js";
import { InteractionCommand } from "../core/interactions/interactionCommand";
import { getUptime } from "../utils/uptime";

export class UptimeInteraction extends InteractionCommand {
  name = "uptime";
  description = "Wie lange ist der Bot schon online?";

  execute(interaction: CommandInteraction) {
    interaction.reply(`**${this.bot.client.user?.username}** ist seit ${getUptime()} aktiv!`);
  }
}
