/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.execute = async (bot, invite) => {
  if (invite.partial) return;

  bot.logger.admin_red(`:outbox_tray: Die Einladung: ${invite.url} **wurde gelöscht**.`, `Code: ${invite.code}`);
};
