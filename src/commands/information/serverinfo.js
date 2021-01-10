/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "serverinfo",
  help: "Server Informationen",
  usage: "serverinfo",
  execute: async (bot, message, args) => {
    const guild = message.guild;

    const embed = new MessageEmbed()
      .setAuthor(guild.name, guild.iconURL())
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

    message.channel.send(embed);
  },
};
