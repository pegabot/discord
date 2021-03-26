/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { resolveUser, BotExecption } = require("../../utils");
const { MessageCollector } = require("discord.js");

module.exports = {
  name: "ban",
  usage: "ban <user>",
  help: "Bannt einen bestimmen Benutzer",
  permissions: ["BAN_MEMBERS"],
  execute: async (bot, msg, args) => {
    if (args.length < 1) throw new BotExecption("Ich brauche einen Benutzer zum bannen!");

    const user = resolveUser(msg, args.join(" "));
    if (!user) throw new BotExecption(`Der Benutzer ${args.join(" ")} wurde nicht gefunden`);
    if (user.id === msg.author.id) throw new BotExecption(`Du kannst dich selbst nicht bannen!`);

    if (user.bannable) {
      msg.channel.send("Was ist der Grund des Bannes?");
      const collector = new MessageCollector(msg.channel, (m) => m.author === msg.author, { max: 1, time: 60000 });
      collector.on("collect", async (m) => {
        await user.ban({ reason: m.content });
        msg.channel.send(`Der Benutzer ${user.user.username} wurde erfolgreich gebannt. Grund: \`${m.content}\``);
        collector.stop();
      });

      collector.on("end", async (collected, reason) => {
        if (reason === "time") {
          msg.channel.send("Das Zeitfenster wurde nicht eingehalten.");
        }
      });
    } else {
      throw new BotExecption("Der Benutzer konnte nicht gebannt werden!");
    }
  },
};
