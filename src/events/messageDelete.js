/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");

exports.run = async (bot, msg) => {
  if (msg.channel.id === bot.config.adminChannel) return;
  if (msg.author.id === bot.user.id) return;
  if (bot.config.ignoredChannels) {
    if (bot.config.ignoredChannels.split(",").includes(msg.channel.id)) return;
  }

  const embed = new MessageEmbed().setDescription(`Neue gelöschte Nachricht von ${msg.member} in ${msg.channel}`).addField("Inhalt der gelöschten Nachricht", msg.content ? msg.content : "Diese Nachricht hatte keinen Inhalt.");

  if (msg.embeds.length > 0) {
    embed.addField("Embed", "Diese Nachricht hatte eine zusätzliche Einbettung, welche nach dieser Nachricht geschickt wird.");
  }

  await bot.logger.admin(embed);

  if (msg.embeds.length > 0) {
    await bot.logger.admin("Die gelöschte Einbettung", { embed: msg.embeds[0] });
  }
};
