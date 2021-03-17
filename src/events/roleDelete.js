/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.execute = async (bot, role) => {
  if (role.partial) return;

  bot.logger.admin_red(`:inbox_tray: Die Rolle: \`${role.name}\` **wurde gelöscht**.`, `ID: ${role.id}`);
};
