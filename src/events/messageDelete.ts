/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageEmbed } from "discord.js";
import bot from "../bot";
import { Event } from "../core/events/event";

export default new Event("messageDelete", async (message) => {
  if (message.channel.id === bot.config.adminChannel) return;
  if (message.author?.id === bot.client.user?.id) return;
  if (bot.config.ignoredChannels) {
    if (bot.config.ignoredChannels.split(",").includes(message.channel.id)) return;
  }

  await new Promise((res) => setTimeout(res, 500));
  const guild = message.guild;

  const auditLog = await guild?.fetchAuditLogs();

  const deleteAction = auditLog?.entries.first();

  let executor = deleteAction?.executor;

  if (deleteAction?.action !== "MESSAGE_DELETE") {
    executor = message.author;
  }

  bot.client.emit("removeMessageFromDatabase", message.id);

  const { channel, content, author, id } = message;
  const embed = new MessageEmbed()
    .setAuthor(executor?.tag || "Unbekannter Löscher", executor?.avatarURL() || "")
    .setTitle("Nachricht gelöscht")
    .setThumbnail(executor?.avatarURL() || "")
    .addField("Wer hat die Nachricht verschickt?", `${author || "Ein unbekanntes Mitglied"}`, true)
    .addField("Kanal", `${channel}`, true)
    .addField("Gelöscht von", `${executor || "Unbekannt"}`, true)
    .addField("Inhalt", content || "Unbekannt")
    .setFooter(`ID: ${id}`)
    .setTimestamp(new Date())
    .setColor("#ee1111");

  bot.logger.admin(embed);
});
