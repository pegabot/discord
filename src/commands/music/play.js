/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

module.exports = {
  name: "play",
  usage: ["play <video url>", "play <video id>"],
  help: "Füge einen Titel zur Warteschlange hinzu.",
  owner: true,
  channel: ["803042555025293332"],
  execute: async (bot, msg, args) => {
    const serverQueue = bot.jukebox.queue.get(msg.guild.id);

    bot.jukebox.execute(msg, serverQueue, args);
  },
};
