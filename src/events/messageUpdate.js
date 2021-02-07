/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");

exports.execute = async (bot, oldMessage, newMessage) => {
  try {
    await oldMessage.fetch(true);
    await newMessage.fetch(true);
    if (newMessage?.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const embed = new MessageEmbed()
      .setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL())
      .setDescription(`Nachricht bearbeitet von ${newMessage.author} in ${newMessage.channel} [Springe zur Nachricht](${newMessage.url})`)
      .addField("Vorher", oldMessage.content || "unknown content")
      .addField("Nachher", newMessage.content || "unknown content")
      .setTimestamp(new Date());

    bot.logger.admin(embed);
  } catch (err) {
    console.log(err.message);
  }
};
