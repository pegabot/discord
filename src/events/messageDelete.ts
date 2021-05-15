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
    .setAuthor(executor?.tag || "Unknown Deleter", executor?.avatarURL() || "")
    .setTitle("Message Deleted")
    .setThumbnail(executor?.avatarURL() || "")
    .addField("Message Sender", `${author || "An unknown user"}`, true)
    .addField("Channel", `${channel}`, true)
    .addField("Deleted By", `${executor || "Unknown"}`, true)
    .addField("Message Content", content || "Unknown content")
    .setFooter(`ID: ${id}`)
    .setTimestamp(new Date())
    .setColor("#ee1111");

  bot.logger.admin(embed);
});
