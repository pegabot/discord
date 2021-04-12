/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../classes/command";
import { BotExecption } from "../../utils/BotExecption";

export class ServerinfoCommand extends Command {
  name = "serverinfo";
  help = "Server Informationen";
  usage = "serverinfo";

  execute(msg: Message): void {
    const guild = msg.guild;
    if (!guild) throw new BotExecption("Ein Fehler ist aufgetreten!");

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

    msg.channel.send(embed);
  }
}
