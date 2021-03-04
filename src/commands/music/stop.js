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
    try {
      bot.jukebox.stop(msg);
    } catch (error) {
      msg.reply("so wie es aussschaut, spiele ich im Moment keine Musik ab.");
    }
  },
};
