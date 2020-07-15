exports.run = (bot, error) => {
  const embed = new MessageEmbed().setTitle(`:x: an error ocurred: ${error}`);

  bot.channels.resolve(bot.config.modLog).send(embed);
};

exports.info = {
  development: true,
};
