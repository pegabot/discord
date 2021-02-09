/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

module.exports = {
  name: "play",
  usage: ["play <name|url>"],
  help: "Füge einen Titel zur Warteschlange hinzu.",
  channel: ["803042555025293332"],
  execute: async (bot, msg, args) => {
    bot.jukebox.play(msg, args);
  },
};
