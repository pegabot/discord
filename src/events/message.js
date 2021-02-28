/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const Levels = require("discord-xp");

exports.execute = async (bot, message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (bot.config.ignoredChannels) {
    if (bot.config.ignoredChannels.split(",").includes(message.channel.id)) return;
  }

  if (bot.config.ignoredCategories) {
    if (message.channel.parentID) {
      if (bot.config.ignoredCategories.split(",").includes(message.channel.parentID)) return;
    }
  }

  if (message.content.match(/(\/r\s?.*|\/roll\s?.*)/)) return message.reply(`bitte verwende \`${bot.config.prefix}roll\` oder \`${bot.config.prefix}r\`!`);

  if (!message.content.startsWith(bot.config.prefix)) {
    const MessageModel = bot.db.model("message");
    const messageToSave = new MessageModel();
    messageToSave.message = JSON.parse(JSON.stringify(message));
    messageToSave.author = JSON.parse(JSON.stringify(message.author));
    messageToSave.channel = JSON.parse(JSON.stringify(message.channel));
    messageToSave.save();

    const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
    if (hasLeveledUp) {
      const user = await Levels.fetch(message.author.id, message.guild.id);
      message.channel.send(`${message.author}, glückwunsch! Du hast Level **${user.level}** erreicht. :tada:`);
    }
  }

  bot.commands.handleCommand(message);
};
