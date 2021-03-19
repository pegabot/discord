/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.module = {
  setDefault: (bot) => {
    bot.user.setActivity(`${bot.config.prefix}help`, { type: "LISTENING" });
  },
};
