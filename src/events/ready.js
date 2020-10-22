/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

exports.run = (bot) => {
  bot.commands.loadCommands();

  const message = `${bot.user.username}#${bot.user.discriminator} ist ready!
    -------------------------------
      ID: ${bot.user.id}
      Aktuell in ${bot.guilds.cache.size} Guilde(n)
      ${bot.commands.size} Command(s) geladen 🤖,
      ${bot.events.length} Event(s) geladen 🎟
      ${bot.functions.length} Function(s) aktiviert ⚙️`;

  bot.logger.info(message);
  if (process.env.NODE_ENV === "production") bot.channels.resolve(bot.config.adminChannel).send(message);
  bot.user.setActivity(`${Array.from(bot.guilds.cache)[0][1].members.cache.size} members wohoo 🎉`, { type: "WATCHING" });
};
