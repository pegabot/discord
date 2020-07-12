const { stripIndents } = require("../utils");

exports.run = (bot, member) => {
  bot.channels.resolve(bot.config.welcomeChannel).send(
    stripIndents(`
        Wilkommen an Bord ${member}!`),
  );
};
