/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.execute = async (bot, channel) => {
  if (channel.type === "dm") return;
  bot.logger.admin_green(`:inbox_tray: Der Kanal: ${channel} **wurde erstellt**.`);
};
