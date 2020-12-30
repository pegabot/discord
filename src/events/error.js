/*
 * Copyright (c) 2020 - 2021 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

exports.run = (bot, error) => {
  const embed = new MessageEmbed().setTitle(`:x: ein Fehler ist aufgetreten: ${error}`);

  bot.channels.resolve(bot.config.errorChannel).send(embed);
};
