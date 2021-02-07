/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.execute = (bot) => {
  bot.commands.loadCommands();
  bot.jobs.loadJobs();

  const message = `${bot.user.username}#${bot.user.discriminator} ist ready!
    -------------------------------
      ID: ${bot.user.id}
      Aktuell in ${bot.guilds.cache.size} Guilde(n)
      ${bot.commands.size} Command(s) geladen 🤖,
      ${bot.events.size} Event(s) geladen 🎟
      ${Object.keys(bot.db.modelSchemas).length} Models(s) geladen 🧭
      ${bot.jobs.size} Job(s) aktiviert ⚙️`;

  bot.logger.info(message);
  if (process.env.NODE_ENV === "production") bot.logger.admin(message);
  bot.user.setActivity(`pegasus.de/youtube 🍹`, { type: "WATCHING" });
};
