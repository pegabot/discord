/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

module.exports = {
  name: "stop",
  usage: ["stop"],
  help: "Stoppe die Wiedergabe und setze die Wartschlange zurück.",
  channel: ["803042555025293332"],
  execute: async (bot, msg, args) => {
    bot.jukebox.stop(msg);
  },
};
