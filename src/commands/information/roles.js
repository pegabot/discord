/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "roles",
  aliases: ["rollen"],
  help: "Zeige alle Rollen des Server an",
  usage: "roles",
  execute: async (bot, msg, args) => {
    const roles = msg.guild.roles.cache
      .array()
      .filter((role) => !role.managed && role.name !== "@everyone")
      .sort((a, b) => b.rawPosition - a.rawPosition);

    const embed = new MessageEmbed()
      .setAuthor(bot.user.username, bot.user.displayAvatarURL())
      .setThumbnail(msg.guild.iconURL())
      .setTitle(`Rollen in ${msg.guild.name}`)
      .setDescription(roles.map((role) => `${role}\n`).join(""))
      .setColor(bot.colors.orange)
      .setFooter(`Rollen: ${roles.length}`)
      .setTimestamp(new Date());
    msg.channel.send(embed);
  },
};
