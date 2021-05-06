/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageEmbed } from "discord.js";
import os from "os";
import bot from "../bot";
import { colors } from "../constants/colors";
import { formatBytes } from "./formats";
import { getUptime } from "./uptime";

export const getSystemStatus = (): MessageEmbed => {
  const core = os.cpus()[0];

  return new MessageEmbed()
    .setAuthor(bot.client.user?.tag, bot.client.user?.displayAvatarURL())
    .setTitle("System Status")
    .setColor(colors.blue)
    .addField("System", [
      `**» Platform:** ${process.platform}`,
      `**» Uptime:** ${getUptime()}`,
      `**» CPU:**`,
      `\u3000 Cores: ${os.cpus().length}`,
      `\u3000 Model: ${core.model}`,
      `\u3000 Speed: ${core.speed}MHz`,
      `**» Memory:**`,
      `\u3000 Total: ${formatBytes(process.memoryUsage().heapTotal)}`,
      `\u3000 Used: ${formatBytes(process.memoryUsage().heapUsed)}`,
    ])
    .setTimestamp();
};
