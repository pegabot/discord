/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.execute = async (bot, invite) => {
  bot.logger.admin_green(`:inbox_tray: Die Einladung: ${invite.url} wurde von ${invite.inviter} **erstellt**.`, `Code: ${invite.code}`);
};
