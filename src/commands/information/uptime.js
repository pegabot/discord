/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const prettyMs = require("pretty-ms");

module.exports = {
  name: "uptime",
  aliases: ["up"],
  usage: "uptime",
  help: "Get the bots uptime",
  execute: (bot, msg, args) => {
    msg.channel.send(`**${bot.user.username}** ist seit ${prettyMs(bot.uptime)} aktiv!`);
  },
};
