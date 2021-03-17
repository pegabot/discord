/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");

exports.execute = async (bot, message) => {
  if (message.partial) return;

  if (message.channel.id === bot.config.adminChannel) return;
  if (message.author.id === bot.user.id) return;
  if (bot.config.ignoredChannels) {
    if (bot.config.ignoredChannels.split(",").includes(message.channel.id)) return;
  }

  const embed = new MessageEmbed()
    .setDescription(`Neue gelöschte Nachricht von ${message.member} in ${message.channel}`)
    .addField("Inhalt der gelöschten Nachricht", message.content ? message.content : "Diese Nachricht hatte keinen Inhalt.");

  if (message.embeds.length > 0) {
    embed.addField("Embed", "Diese Nachricht hatte eine zusätzliche Einbettung, welche nach dieser Nachricht geschickt wird.");
  }

  await bot.logger.admin(embed);

  if (message.embeds.length > 0) {
    await bot.logger.admin("Die gelöschte Einbettung", { embed: message.embeds[0] });
  }
};
