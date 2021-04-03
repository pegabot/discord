/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { MessageEmbed, TextChannel } from "discord.js";
import { BotType } from "../types/bot";
import { stripIndents } from "../utils/stripIndents";

export class LogHandler {
  bot: BotType;
  constructor(bot: BotType) {
    this.bot = bot;
  }

  admin(msg: string | MessageEmbed): void {
    const channel = this.bot.channels.resolve(this.bot.config?.adminChannel || "");
    if (!channel) return;
    (channel as TextChannel).send(stripIndents(msg));
  }

  admin_red(msg: string, footer?: string): void {
    const channel = this.bot.channels.resolve(this.bot.config?.adminChannel || "");
    if (!channel) return;
    (channel as TextChannel).send(
      new MessageEmbed()
        .setDescription(stripIndents(msg))
        .setTimestamp(Date.now())
        .setColor(this.bot.colors?.red || "")
        .setFooter(footer || ""),
    );
  }

  admin_green(msg: string, footer?: string): void {
    const channel = this.bot.channels.resolve(this.bot.config?.adminChannel || "");
    if (!channel) return;
    (channel as TextChannel).send(
      new MessageEmbed()
        .setDescription(stripIndents(msg))
        .setTimestamp(Date.now())
        .setColor(this.bot.colors?.green || "")
        .setFooter(footer || ""),
    );
  }

  admin_blue(msg: string, footer?: string): void {
    const channel = this.bot.channels.resolve(this.bot.config?.adminChannel || "");
    if (!channel) return;
    (channel as TextChannel).send(
      new MessageEmbed()
        .setDescription(stripIndents(msg))
        .setTimestamp(Date.now())
        .setColor(this.bot.colors?.blue || "")
        .setFooter(footer || ""),
    );
  }

  info(msg: string): void {
    console.log(stripIndents(msg));
  }

  error(msg: string): void {
    console.error("⚠️ ", "\x1b[31m", stripIndents(msg), "\x1b[0m");
  }
}
