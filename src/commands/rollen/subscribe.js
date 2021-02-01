/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { BotExecption } = require("../../utils");

module.exports = {
  name: "subscribe",
  usage: ["subscribe"],
  help: "Dieser Command fügt dir eine Rolle hinzu/ entfernt dir eine Rolle, welche verwendet wird, um dich bei Neuigkeiten zu informieren.",
  execute: async (bot, msg, args) => {
    try {
      const { member } = msg;
      if (member.roles.cache.has(bot.config.notificationRole)) {
        await member.roles.remove(bot.config.notificationRole);
        msg.reply("Rolle entfernt. Du wirst nicht weiter informiert.");
      } else {
        await member.roles.add(bot.config.notificationRole);
        msg.reply("Rolle hinzugefügt. Du wirst ab sofort informiert.");
      }
    } catch (err) {
      throw new BotExecption("Rolle konnte nicht hinzugefügt/ entfernt werden!");
    }
  },
};
