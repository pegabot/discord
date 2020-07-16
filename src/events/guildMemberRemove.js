const { MessageEmbed } = require("discord.js");

exports.run = (bot, member) => {
  const embed = new MessageEmbed().setTitle(`${member.user.tag} hat gerade den Server verlassen.`);

  bot.channels.resolve(bot.config.modLog).send(embed);
};