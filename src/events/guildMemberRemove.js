const { MessageEmbed } = require("discord.js");

exports.run = (bot, member) => {
  const embed = new MessageEmbed().setTitle(`${member.user.tag} just left the server`);

  bot.channels.resolve(bot.config.modLog).send(embed);
};

exports.info = {
  development: true,
};
