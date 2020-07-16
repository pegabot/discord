exports.run = (bot, error) => {
  const embed = new MessageEmbed().setTitle(`:x: ein Fehler ist aufgetreten: ${error}`);

  bot.channels.resolve(bot.config.modLog).send(embed);
};

exports.info = {
  development: true,
};