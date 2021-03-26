/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.execute = (bot, guild, user) => {
  if (guild.partial) return;

  bot.logger.admin_green(`${user.tag} wurde gerade vom Server entbannt.`);
};
