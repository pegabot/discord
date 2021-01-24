/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

module.exports = {
  name: "stop",
  usage: ["stop"],
  help: "Stoppe die Wiedergabe und setze die Wartschlange zurück.",
  execute: async (bot, msg, args) => {
    const serverQueue = bot.jukebox.queue.get(msg.guild.id);

    bot.jukebox.stop(msg, serverQueue);
  },
};
