/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, MessageEmbed } from "discord.js";
import { Event } from "../classes/event";
import { colors } from "../constants/colors";

export class messageDeleteEvent extends Event {
  async execute(message: Message) {
    if (message.partial) {
      message = await message.fetch();
    }

    if (message.channel.id === this.bot.config.adminChannel) return;
    if (message.author.id === this.bot.client.user?.id) return;
    if (this.bot.config.ignoredChannels) {
      if (this.bot.config.ignoredChannels.split(",").includes(message.channel.id)) return;
    }

    await new Promise((res) => setTimeout(res, 500));
    const guild = message.guild;

    if (!guild) return;

    const auditLog = await guild.fetchAuditLogs();

    const deleteAction = await auditLog.entries.first();

    let executor = deleteAction?.executor;

    if (deleteAction?.action !== "MESSAGE_DELETE") {
      executor = message.author;
    }

    const { channel, content, author, id } = message;

    const embed = new MessageEmbed()
      .setAuthor(executor?.tag || "Unbekannter User", executor?.avatarURL?.() || "")
      .setTitle("Nachricht gelöscht")
      .setThumbnail(executor?.avatarURL() || "")
      .addField("Nachricht geschrieben von", `${author || "Unbekannter User"}`, true)
      .addField("Kanal", `${channel}`, true)
      .addField("Gelöscht von", `${executor || "Unbekannt"}`, true)
      .addField("Inhalt", content || "Unbekannter Inhalt")
      .setFooter(`ID: ${id}`)
      .setTimestamp(new Date())
      .setColor(colors.red);

    this.bot.logger.admin(embed);
  }
}
