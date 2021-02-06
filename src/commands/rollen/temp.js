/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { BotExecption } = require("../../utils");

const expiresInterval = 1000 * 60 * 60 * 24; // Milliseconds * Seconds * Minutes * Hours

module.exports = {
  name: "temp",
  usage: ["temp"],
  help: "Dieser Command fügt dir eine Rolle hinzu/ entfernt dir eine Rolle, welche verwendet wird, um dich bei Neuigkeiten zu informieren.",
  execute: async (bot, msg, args) => {
    try {
      const { member } = msg;
      const roleId = bot.config.tempRole;
      const userId = member.id;

      const userGivenRolesModel = bot.db.model("userGivenRoles");

      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);

        const entries = await userGivenRolesModel.find({ userId: userId, roleId: roleId });
        entries.forEach((entry) => entry.remove());
        msg.reply("Die Rolle wurde wieder entfernt.");
      } else {
        await member.roles.add(roleId);
        const entry = new userGivenRolesModel();
        entry.userId = userId;
        entry.roleId = roleId;
        entry.expires = Number(Date.now()) + expiresInterval;
        entry.save();
        msg.reply("Rolle hinzugefügt.");
      }
    } catch (err) {
      throw new BotExecption("Rolle konnte nicht hinzugefügt/ entfernt werden!");
    }
  },
};
