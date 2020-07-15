const { MessageEmbed } = require("discord.js");

exports.run = (bot, guild, user) => {
  const embed = new MessageEmbed().setTitle(`${user.tag} was just unbanned from the server`);

  bot.channels.resolve(bot.config.modLog).send(embed);
};

exports.info = {
  development: true,
};
