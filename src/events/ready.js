exports.run = (bot) => {
  bot.commands.loadCommands();

  bot.logger.info(
    `${bot.user.username}#${bot.user.discriminator} is ready!
        -------------------------------
        ID: ${bot.user.id}
        Currently in ${bot.guilds.cache.size} guild(s)
        Loaded ${bot.commands.size} command(s) 🤖`,
  );

  bot.user.setActivity("living in the Cloud ☁️", { type: "WATCHING" });
};

exports.info = {
  development: true,
};
