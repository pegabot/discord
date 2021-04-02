/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message, MessageEmbed } from "discord.js";
import { BotEvent } from "../classes/event";

export class messageDeleteEvent extends BotEvent {
  execute(message: Message): void {
    if (message.partial) return;

    if (message.channel.id === this.bot.config?.adminChannel) return;
    if (message.author.id === this.bot.user?.id) return;
    if (this.bot.config?.ignoredChannels) {
      if (this.bot.config.ignoredChannels.split(",").includes(message.channel.id)) return;
    }

    const embed = new MessageEmbed()
      .setDescription(`Neue gelöschte Nachricht von ${message.member} in ${message.channel}`)
      .addField("Inhalt der gelöschten Nachricht", message.content ? message.content : "Diese Nachricht hatte keinen Inhalt.");
  }
}
