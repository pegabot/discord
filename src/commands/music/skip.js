/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

module.exports = {
  name: "skip",
  usage: ["skip"],
  help: "Überspringe einen Titel in der Warteschlange.",
  execute: async (bot, msg, args) => {
    const serverQueue = bot.jukebox.queue.get(msg.guild.id);

    bot.jukebox.skip(msg, serverQueue);
  },
};
