exports.run = (bot) => {
  bot.commands.loadCommands();

  bot.logger.info(
    `${bot.user.username}#${bot.user.discriminator} ist ready!
        -------------------------------
        ID: ${bot.user.id}
        Aktuell in ${bot.guilds.cache.size} Guilde(n)
        ${bot.commands.size} Command(s) geladen 🤖,
        ${bot.events.length} Event(s) geladen 🎟
        ${bot.functions.length} Function(s) aktiviert ⚙️`,
  );

  bot.user.setActivity("nach dem Rechten 👀", { type: "WATCHING" });
};
