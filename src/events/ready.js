exports.run = (bot) => {
  bot.commands.loadCommands();

  bot.logger.info(
    `${bot.user.username}#${bot.user.discriminator} ist ready!
        -------------------------------
        ID: ${bot.user.id}
        Aktuell in ${bot.guilds.cache.size} Guilde(n)
        ${bot.commands.size} Command(s) geladen 🤖`,
  );

  bot.user.setActivity("nach dem Rechten 👀", { type: "WATCHING" });
};

exports.info = {
  development: true,
};
