/*
 * Copyright (c) 2020 - 2021 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { MessageEmbed } = require("discord.js");

exports.run = (bot, guild, user) => {
  const embed = new MessageEmbed().setTitle(`${user.tag} wurde gerade vom Server unbannt.`);

  bot.channels.resolve(bot.config.goodbyeChannel).send(embed);
};
