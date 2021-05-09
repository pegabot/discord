/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { colors } from "debug-logger";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { InteractionCommand } from "../core/interactions/interactionCommand";

export class RolesInteraction extends InteractionCommand {
  name = "roles";
  description = "Welche Rollen gibt es hier auf dem Server?";

  execute(interaction: CommandInteraction) {
    const roles = interaction.guild?.roles.cache
      .array()
      .filter((role) => !role.managed && role.name !== "@everyone")
      .sort((a, b) => b.rawPosition - a.rawPosition);

    const embed = new MessageEmbed()
      .setAuthor(this.bot.client.user?.username, this.bot.client.user?.displayAvatarURL())
      .setThumbnail(interaction?.guild?.iconURL() || "")
      .setTitle(`Rollen in ${interaction.guild?.name}`)
      .setDescription(roles?.map((role) => `${role}\n`).join(""))
      .setColor(colors.orange)
      .setFooter(`Rollen: ${roles?.length}`)
      .setTimestamp(new Date());

    interaction.reply(embed);
  }
}
