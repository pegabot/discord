/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.run = (bot) => {
  bot.commands.loadCommands();
  bot.functions.loadFunctions();

  const message = `${bot.user.username}#${bot.user.discriminator} ist ready!
    -------------------------------
      ID: ${bot.user.id}
      Aktuell in ${bot.guilds.cache.size} Guilde(n)
      ${bot.commands.size} Command(s) geladen 🤖,
      ${bot.events.size} Event(s) geladen 🎟
      ${Object.keys(bot.db.modelSchemas).length} Models(s) geladen 🧭
      ${bot.functions.size} Function(s) aktiviert ⚙️`;

  bot.logger.info(message);
  if (process.env.NODE_ENV === "production") bot.channels.resolve(bot.config.adminChannel).send(message);

  bot.user.setActivity(`pegasus.de/youtube 🍹`, { type: "WATCHING" });
};
