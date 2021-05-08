/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction, MessageEmbed } from "discord.js";
import { InteractionCommand, InteractionErrors } from "../core/interactions/interactionCommand";

export class ServerinfoInteraction extends InteractionCommand {
  name = "serverinfo";
  description = "Informationen zu diesem Server";

  execute(interaction: CommandInteraction) {
    const guild = interaction.guild;
    if (!guild) return this.error(interaction, InteractionErrors.INTERNAL_ERROR);

    const embed = new MessageEmbed()
      .setAuthor(guild.name, guild?.iconURL() || "")
      .setTitle(`Infos über ${guild.name}`)
      .addField("Discord Partnerschaft?", guild.partnered ? "Ja" : "Nein", true)
      .addField("Region", guild.region, true)
      .addField("Kategorien", [...new Set(guild.channels.cache.array().map((channel) => channel.parentID))].length, true)
      .addField("Text Kanäle", guild.channels.cache.array().filter((channel) => channel.type === "text").length, true)
      .addField("Sprach Kanäle", guild.channels.cache.array().filter((channel) => channel.type === "voice").length, true)
      .addField("Mitglieder", guild.memberCount, true)
      .addField(
        `Rollen - ${guild.roles.cache.array().filter((role) => !role.managed && role.name !== "@everyone").length}`,
        guild.roles.cache
          .array()
          .filter((role) => !role.managed && role.name !== "@everyone")
          .sort((a, b) => b.rawPosition - a.rawPosition)
          .join(", "),
      )
      .setFooter(`ID: ${guild.id} | Server erstellt:`)
      .setTimestamp(guild.createdAt);

    interaction.reply(embed);
  }
}
