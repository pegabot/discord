/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { stripIndents } = require("../utils");

exports.Logger = class {
  constructor(bot) {
    this.bot = bot;
  }

  admin(msg) {
    this.bot.channels.resolve(this.bot.config.adminChannel).send(msg);
  }

  info(msg) {
    console.log(stripIndents(msg));
  }

  error(msg) {
    console.error("⚠️ ", "\x1b[31m", stripIndents(msg), "\x1b[0m");
  }
};
