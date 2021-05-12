/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageEmbed } from "discord.js";
import bot from "../bot";
import { colors } from "../constants/colors";
import { Event } from "../core/events/event";

export default new Event("messageDelete", async (message) => {
  if (message.channel.id === bot.config.adminChannel) return;
  if (message.author?.id === bot.client.user?.id) return;
  if (bot.config.ignoredChannels) {
    if (bot.config.ignoredChannels.split(",").includes(message.channel.id)) return;
  }

  await new Promise((res) => setTimeout(res, 500));

  const { channel, content, author, id } = message;
  const embed = new MessageEmbed()
    .setAuthor(message.author?.tag || "Unbekannter User", message.author?.avatarURL?.() || "")
    .setTitle("Nachricht gelöscht")
    .addField("Nachricht geschrieben von", `${author || "Unbekannter User"}`, true)
    .addField("Kanal", `${channel}`, true)
    .addField("Inhalt", content || "Unbekannter Inhalt")
    .setFooter(`ID: ${id}`)
    .setTimestamp(new Date())
    .setColor(colors.red);

  bot.logger.admin(embed);
});
