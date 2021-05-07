/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import Levels from "discord-xp";
import { TextChannel } from "discord.js";
import bot from "../bot";
import { Event } from "../core/events/event";
import { MessageModel } from "../models/message";

export default new Event("message", async (message) => {
  if (message.partial) return;

  if (!message.guild) return;
  if (message.author.bot) return;

  if (message.content.match(/^(\/r\s?.*|\/roll\s?.*)/)) {
    message.reply(`bitte verwende \`${bot.config.prefix}roll\` oder \`${bot.config.prefix}r\`!`);
    return;
  }
  if (!message.content.startsWith(bot.config.prefix || "")) {
    if (bot.config.ignoredChannels) {
      if (bot.config.ignoredChannels.split(",").includes(message.channel.id)) return;
    }

    if (bot.config.ignoredCategories) {
      if (message.channel.type !== "dm" && message.channel.parentID) {
        if (bot.config.ignoredCategories.split(",").includes(message.channel.parentID)) return;
      }
    }

    const messageToSave = new MessageModel();
    messageToSave.message = JSON.parse(JSON.stringify(message));
    messageToSave.author = JSON.parse(JSON.stringify(message.author));
    messageToSave.channel = JSON.parse(JSON.stringify(message.channel as TextChannel));
    messageToSave.save();

    const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
    if (hasLeveledUp) {
      const user = await Levels.fetch(message.author.id, message.guild.id);
      message.channel.send(`${message.author}, glückwunsch! Du hast Level **${user.level}** erreicht. :tada:`);
    }
  }

  bot.commands.handleCommand(message);
});
