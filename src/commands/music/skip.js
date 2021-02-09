/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

module.exports = {
  name: "skip",
  usage: ["skip"],
  help: "Überspringe einen Titel in der Warteschlange.",
  channel: ["803042555025293332"],
  execute: async (bot, msg, args) => {
    bot.jukebox.skip(msg);
  },
};
