/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */
const { ChannelTypes } = require("../utils");

exports.execute = async (bot, channel) => {
  if (channel.type === "dm") return;
  bot.logger.admin_green(`:inbox_tray: ${ChannelTypes.get(channel.type)}: ${channel} **wurde erstellt**.`);
};
