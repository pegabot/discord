/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { BotExecption } = require("../../utils");

module.exports = {
  name: "slowmode",
  usage: ["slowmode", "slowmode <Sekunden>"],
  help: "Einstellungen für den Slowmode",
  permissions: ["MANAGE_CHANNELS"],
  execute: async (bot, msg, args) => {
    if (!args[0]) {
      msg.channel.send(`Aktuell beträgt die Slowmode Rate ${msg.channel.rateLimitPerUser} Sekunde(n)`);
    } else {
      if (Number.isNaN(args[0])) throw new BotExecption("Dein übergebener Wert ist keine Zahl.");
      await msg.channel.setRateLimitPerUser(args[0]);
      msg.channel.send(`Die neue Slowmode Rate beträgt nun ${msg.channel.rateLimitPerUser} Sekunde(n)`);
    }
  },
};
