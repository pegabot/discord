/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

exports.run = (bot) => {
  bot.commands.loadCommands();
  bot.functions.loadFunctions();

  const message = `${bot.user.username}#${bot.user.discriminator} ist ready!
    -------------------------------
      ID: ${bot.user.id}
      Aktuell in ${bot.guilds.cache.size} Guilde(n)
      ${bot.commands.size} Command(s) geladen 🤖,
      ${bot.events.length} Event(s) geladen 🎟
      ${bot.functions.size} Function(s) aktiviert ⚙️`;

  bot.logger.info(message);
  if (process.env.NODE_ENV === "production") bot.channels.resolve(bot.config.adminChannel).send(message);
  let membersCount = 0;
  bot.users.cache.map((users) => (users.id ? (membersCount += 1) : false)).pop();

  bot.user.setActivity(`nach dem Rechten 👀`, { type: "WATCHING" });
};
