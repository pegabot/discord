/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");

exports.run = (bot, guild, user) => {
  const embed = new MessageEmbed().setTitle(`${user.tag} wurde gerade vom Server unbannt.`);

  bot.channels.resolve(bot.config.goodbyeChannel).send(embed);
};
