/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.execute = async (bot, channel) => {
  bot.logger.admin_red(`:inbox_tray: Der Kanal: #${channel.name} **wurde gelöscht**.`);
};
