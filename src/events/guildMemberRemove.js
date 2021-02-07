/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");

exports.execute = (bot, member) => {
  const embed = new MessageEmbed().setTitle(`${member.user.tag} hat gerade den Server verlassen.`);

  bot.channels.resolve(bot.config.goodbyeChannel).send(embed);
};
