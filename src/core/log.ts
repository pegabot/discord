/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageEmbed, TextChannel } from "discord.js";
import { colors } from "../constants/colors";
import { isProduction } from "../utils/environment";
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

  admin_error(msg: string, title?: string, footer?: string): void {
    if (!isProduction()) console.error(msg, title);

    const channel = this.bot.client.channels.resolve(this.bot.config.errorChannel || "");
    if (!channel) return;
    (channel as TextChannel).send(
      new MessageEmbed()
        .setDescription(stripIndents(msg))
        .setTitle(title)
        .setTimestamp(Date.now())
        .setColor(colors.red)
        .setFooter(footer || ""),
    );
  }

  admin_error_embed(embed: MessageEmbed): void {
    if (!isProduction()) console.error(embed);

    const channel = this.bot.client.channels.resolve(this.bot.config.errorChannel || "");
    if (!channel) return;
    (channel as TextChannel).send(stripIndents(embed));
  }

  console(msg: string): void {
    console.log(stripIndents(msg));
  }

  error(msg: string): void {
    console.error("⚠️ ", "\x1b[31m", stripIndents(msg), "\x1b[0m");
  }
}
