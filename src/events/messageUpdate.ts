/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message, MessageEmbed } from "discord.js";
import gitDiff from "git-diff";
import { BotEvent } from "../classes/event";

export class messageUpdateEvent extends BotEvent {
  async execute(oldMessage: Message, newMessage: Message): Promise<void> {
    if (oldMessage.partial) return;
    if (newMessage.partial) return;

    try {
      await oldMessage.fetch(true);
      await newMessage.fetch(true);
      if (newMessage?.author?.bot) return;
      if (oldMessage.content === newMessage.content) return;

      const embed = new MessageEmbed()
        .setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL())
        .setDescription(`Nachricht bearbeitet von ${newMessage.author} in ${newMessage.channel} [Springe zur Nachricht](${newMessage.url})`)
        .addField(
          "Änderung",
          "```diff\n" + gitDiff(oldMessage.content, newMessage.content, { noHeaders: true, forceFake: true, flags: "--unified=3" }) + "\n```",
        )
        .setTimestamp(new Date());

      this.bot.logger?.admin(embed);
    } catch (err) {
      console.log(err.message);
    }
  }
}
