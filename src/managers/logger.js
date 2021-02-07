/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { stripIndents } = require("../utils");
const { MessageEmbed } = require("discord.js");

exports.Logger = class {
  constructor(bot) {
    this.bot = bot;
  }

  admin(msg) {
    this.bot.channels.resolve(this.bot.config.adminChannel).send(stripIndents(msg));
  }

  admin_red(msg, footer) {
    this.bot.channels.resolve(this.bot.config.adminChannel).send(
      stripIndents(
        new MessageEmbed()
          .setDescription(msg)
          .setTimestamp(Date.now())
          .setColor("#f35858")
          .setFooter(footer || ""),
      ),
    );
  }

  admin_green(msg, footer) {
    this.bot.channels.resolve(this.bot.config.adminChannel).send(
      stripIndents(
        new MessageEmbed()
          .setDescription(msg)
          .setTimestamp(Date.now())
          .setColor("#70f470")
          .setFooter(footer || ""),
      ),
    );
  }

  admin_blue(msg, footer) {
    this.bot.channels.resolve(this.bot.config.adminChannel).send(
      stripIndents(
        new MessageEmbed()
          .setDescription(msg)
          .setTimestamp(Date.now())
          .setColor("#6666ff")
          .setFooter(footer || ""),
      ),
    );
  }

  info(msg) {
    console.log(stripIndents(msg));
  }

  error(msg) {
    console.error("⚠️ ", "\x1b[31m", stripIndents(msg), "\x1b[0m");
  }
};
