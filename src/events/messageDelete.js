const { MessageEmbed } = require("discord.js");

exports.run = async (bot, msg) => {
  const embed = new MessageEmbed().setDescription(`Neue gelöschte Nachricht von ${msg.member} in ${msg.channel}`).addField("Inhalt der gelöschten Nachricht", msg.content ? msg.content : "Diese Nachricht hatte keinen Inhalt.");

  if (msg.embeds.length > 0) {
    embed.addField("Embed", "Diese Nachricht hatte eine zusätzliche Einbettung, welche nach dieser Nachricht geschickt wird.");
  }

  await bot.channels.resolve(bot.config.modLog).send(embed);

  if (msg.embeds.length > 0) {
    bot.channels.resolve(bot.config.modLog).send("Die gelöschte Einbettung", { embed: msg.embeds[0] });
  }
};

exports.info = {
  development: false,
};
