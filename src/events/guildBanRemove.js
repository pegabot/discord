const { MessageEmbed } = require("discord.js");

exports.run = (bot, guild, user) => {
  const embed = new MessageEmbed().setTitle(`${user.tag} wurde gerade vom Server unbannt.`);

  bot.channels.resolve(bot.config.modLog).send(embed);
};

exports.info = {
  development: true,
};
