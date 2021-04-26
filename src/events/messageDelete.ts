/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, MessageEmbed } from "discord.js";
import { Event } from "../classes/event";

export class messageDeleteEvent extends Event {
  execute(message: Message): void {
    if (message.partial) return;

    if (message.channel.id === this.bot.config.adminChannel) return;
    if (message.author.id === this.bot.client.user?.id) return;
    if (this.bot.config.ignoredChannels) {
      if (this.bot.config.ignoredChannels.split(",").includes(message.channel.id)) return;
    }

    const embed = new MessageEmbed()
      .setDescription(`Neue gelöschte Nachricht von ${message.member} in ${message.channel}`)
      .addField("Inhalt der gelöschten Nachricht", message.content ? message.content : "Diese Nachricht hatte keinen Inhalt.");

    this.bot.logger.admin(embed);
  }
}
