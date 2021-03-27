/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");
const { resolveUser, BotExecption } = require("../../utils");

module.exports = {
  name: "blacklist",
  usage: ["blacklist", "blacklist add <user>", "blacklist remove <user>"],
  help: "Fügt Benutzer zu einer Blacklist hinzu, die ihn von der Benutzung dieses Bots ausschließt.",
  permissions: ["BAN_MEMBERS"],
  execute: (bot, msg, args) => {
    if (args.length === 0) {
      const list = bot.blacklist
        .keyArray()
        .map((user) => `- ${bot.blacklist.get(user)} (${user})`)
        .join("\n");
      const embed = new MessageEmbed()
        .setTitle("Die Blacklist")
        .setDescription("Eine Liste mit Benutzer, die von der Verwendung dieses Bots ausgeschlossen sind.")
        .addField("Liste", list.length !== 0 ? list : "Aktuell befinden sich keine Benutzer auf der Blacklist.");
      msg.channel.send(embed);
    } else if (args[0] === "add") {
      if (!args[1]) throw new BotExecption("Bitte übergebe einen Benutzer, der zur Blacklist hinzugefügt werden soll.");

      const user = resolveUser(msg, args[1]);
      if (user.id === msg.author.id) throw new BotExecption(`Du kannst dich selbst nicht auf die Blacklist setzen!`);

      if (user) {
        bot.blacklist.set(user.id, user.user.username);
        msg.channel.send(`Der Benutzer ${user.user.username} wurde erfolgreich zur Blacklist hinzugefügt.`);
      } else {
        throw new BotExecption(`Der Benutzer ${args[1]} wurde nicht gefunden.`);
      }
    } else if (args[0] === "remove") {
      if (!args[1]) throw new BotExecption("Bitte übergebe einen Benutzer, der von der Blacklist entfernt werden soll.");

      const user = resolveUser(msg, args[1]);
      if (user) {
        if (bot.blacklist.has(user.id)) {
          bot.blacklist.delete(user.id);
          msg.channel.send(`Der Benutzer ${user.user.username} wurde erfolgreich von der Blacklist entfernt.`);
        } else {
          throw new BotExecption(`Der Benutzer ${user.user.username} befindet sich nicht auf der Blacklist.`);
        }
      }
    } else {
      throw new BotExecption("Bitte übergebe einen validen Subcommand.");
    }
  },
};
