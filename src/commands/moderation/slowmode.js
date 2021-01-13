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
    const [input] = args;
    if (!input) {
      msg.channel.send(`Aktuell beträgt die Slowmode Rate ${msg.channel.rateLimitPerUser} Sekunde(n)`);
    } else {
      console.log(typeof input);
      if (isNaN(input)) throw new BotExecption("Dein übergebener Wert ist keine Zahl.");
      await msg.channel.setRateLimitPerUser(input);
      msg.channel.send(`Die neue Slowmode Rate beträgt nun ${input} Sekunde(n)`);
    }
  },
};
