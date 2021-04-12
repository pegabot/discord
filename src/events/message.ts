/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import Levels from "discord-xp";
import { Message, TextChannel } from "discord.js";
import { Event } from "../classes/event";
import { MessageModel } from "../models/message";

export class MessageEvent extends Event {
  async execute(message: Message): Promise<void> {
    if (message.partial) return;

    if (!message.guild) return;
    if (message.author.bot) return;

    if (message.content.match(/^(\/r\s?.*|\/roll\s?.*)/)) {
      message.reply(`bitte verwende \`${this.bot.config.prefix}roll\` oder \`${this.bot.config.prefix}r\`!`);
      return;
    }
    if (!message.content.startsWith(this.bot.config.prefix || "")) {
      if (this.bot.config.ignoredChannels) {
        if (this.bot.config.ignoredChannels.split(",").includes(message.channel.id)) return;
      }

      if (this.bot.config.ignoredCategories) {
        if (message.channel.type !== "dm" && message.channel.parentID) {
          if (this.bot.config.ignoredCategories.split(",").includes(message.channel.parentID)) return;
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

    this.bot.commands.handleCommand(message);
  }
}
