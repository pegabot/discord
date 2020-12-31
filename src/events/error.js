/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.run = (bot, error) => {
  const embed = new MessageEmbed().setTitle(`:x: ein Fehler ist aufgetreten: ${error}`);

  bot.channels.resolve(bot.config.errorChannel).send(embed);
};
