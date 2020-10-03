/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { MessageEmbed } = require('discord.js');

exports.run = (bot, guild, user) => {
  const embed = new MessageEmbed().setTitle(`${user.tag} wurde gerade vom Server gebannt.`);

  bot.channels.resolve(bot.config.adminChannel).send(embed);
};
