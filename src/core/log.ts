/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageEmbed, TextChannel } from "discord.js";
import { v4 as uuid } from "uuid";
import bot from "../bot";
import { colors } from "../constants/colors";
import { emojis } from "../constants/emojis";
import { isProduction } from "../utils/environment";
import { generateErrorLogKey, generateLogKey } from "../utils/redis";
import { stripIndents } from "../utils/stripIndents";
import { Bot } from "./bot";

export class LogHandler {
  constructor(protected bot: Bot) {}

  admin(msg: string | MessageEmbed): void {
    const channel = this.bot.client.channels.resolve(this.bot.config.adminChannel || "");
    if (!channel) return;
    (channel as TextChannel).send(stripIndents(msg));
  }

  admin_red(msg: string, footer?: string): void {
    const channel = this.bot.client.channels.resolve(this.bot.config.adminChannel || "");
    if (!channel) return;
    (channel as TextChannel).send(
      new MessageEmbed()
        .setDescription(stripIndents(msg))
        .setTimestamp(Date.now())
        .setColor(colors.red)
        .setFooter(footer || ""),
    );
  }

  admin_green(msg: string, footer?: string): void {
    const channel = this.bot.client.channels.resolve(this.bot.config.adminChannel || "");
    if (!channel) return;
    (channel as TextChannel).send(
      new MessageEmbed()
        .setDescription(stripIndents(msg))
        .setTimestamp(Date.now())
        .setColor(colors.green)
        .setFooter(footer || ""),
    );
  }

  admin_blue(msg: string, footer?: string): void {
    const channel = this.bot.client.channels.resolve(this.bot.config.adminChannel || "");
    if (!channel) return;
    (channel as TextChannel).send(
      new MessageEmbed()
        .setDescription(stripIndents(msg))
        .setTimestamp(Date.now())
        .setColor(colors.blue)
        .setFooter(footer || ""),
    );
  }

  async admin_error(err: Error, title?: string, footer?: string): Promise<void> {
    if (!isProduction()) console.error(err, title);

    const logId = uuid();
    const logKey = generateLogKey(logId);
    bot.redis.client.set(logKey, JSON.stringify(err.stack));

    const channel = this.bot.client.channels.resolve(this.bot.config.errorChannel || "");
    if (!channel) return;
    const message = await (channel as TextChannel).send(
      new MessageEmbed()
        .setDescription(stripIndents(`${isProduction() ? `https://pegabot.pegasus.de/logs/${logId}` : `http://localhost/logs/${logId}`}`))
        .setTitle(title || "Ein Fehler ist aufgetreten ❌")
        .setTimestamp(Date.now())
        .setColor(colors.red)
        .setFooter(footer || ""),
    );

    message.react(emojis.checkEmoji);
    this.bot.redis.client.set(`${generateErrorLogKey(message.id)}`, logKey);
  }

  console(msg: string): void {
    console.log(stripIndents(msg));
  }

  error(msg: string): void {
    console.error("⚠️ ", "\x1b[31m", stripIndents(msg), "\x1b[0m");
  }
}
