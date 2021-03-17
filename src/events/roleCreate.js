/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.execute = async (bot, role) => {
  if (role.partial) return;

  bot.logger.admin_green(`:inbox_tray: Die Rolle: ${role} **wurde erstellt**.`, `ID: ${role.id}`);
};
