/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");
const { BotExecption, findCommand } = require("../../utils");

module.exports = {
  name: "help",
  usage: ["help", "help <command>"],
  help: "Gibt alle verfügbaren Command oder Informationen zu einem spezifischen Command zurück.",
  execute: (bot, msg, args) => {
    if (args.length === 0) {
      const cmdsString = bot.commands.names
        .filter((cmd) => !bot.commands.get(cmd).owner)
        .filter((cmd) => {
          const perms = bot.commands.get(cmd).permissions;
          if (perms && !perms.every((e) => !msg.member.hasPermission(e))) return true;
          if (!perms) return true;
          return false;
        })
        .filter((cmd) => {
          const { roles } = bot.commands.get(cmd);
          if (!roles) return true;
          const roleCheck = roles.some((e) => msg.member.roles.cache.find((role) => role.name.toLowerCase() === e.toLowerCase()));
          if (roles && roleCheck) {
            return true;
          }
          return false;
        })
        .sort()
        .map(
          (cmd) =>
            `${bot.commands.get(cmd).disabled ? `${cmd} (deaktiviert)` : cmd}${
              bot.commands.get(cmd).aliases ? ` (${bot.commands.get(cmd).aliases.join(", ")})` : ""
            }`,
        )
        .map((cmd) => `\`${cmd}\``)
        .join("\n");
      const embed = new MessageEmbed()
        .setAuthor(bot.user.tag, bot.user.displayAvatarURL())
        .setTitle(`Commands für ${msg.guild.name}`)
        .setDescription(`**Tip:** verwende ${bot.config.prefix}help <command>, um Hilfe für einen spezifischen Command zu erhalten.`)
        .addField("Prefix", bot.config.prefix)
        .addField("Verfügbare Commands (Aliase)", cmdsString, true)
        .setColor("#6666ff");

      msg.channel.send(embed);
    } else if (args.length > 0) {
      const command = findCommand(bot.commands.all, args[0]);
      if (!command) throw new BotExecption(`Der Command ${args[0]} wurde nicht gefunden.`);

      let { aliases, permissions, roles, usage, name, disabled, category, help } = command;
      if (permissions && permissions.some((e) => !msg.member.hasPermission(e))) {
        return msg.channel.send("Du versuchst Hilfe für einen Command zu bekommen, für welchen du nicht die Berechtigung besitzt.");
      }
      if (roles) {
        const roleCheck = roles.some((e) => msg.member.roles.cache.find((role) => role.name.toLowerCase() === e.toLowerCase()));
        if (!roleCheck) return msg.channel.send("Du versuchst Hilfe für einen Command zu bekommen, für welchen du nicht die Berechtigung besitzt.");
      }

      if (Array.isArray(usage)) {
        usage = usage.map((el) => bot.config.prefix + el).join("\n");
      } else {
        usage = bot.config.prefix + usage;
      }

      const embed = new MessageEmbed()
        .setAuthor(bot.user.tag, bot.user.displayAvatarURL())
        .setTitle(`Hilfe für **${bot.config.prefix}${name} ${disabled ? " (deaktiviert)" : ""}**`)
        .addField("Verwendung(en)", usage, true)
        .addField("Kategorie", category, true)
        .addField("Aliase", aliases ? aliases.join(", ") : "keine", true)
        .addField("Berechtigungen", permissions ? permissions.join("\n") : "keine", true)
        .setDescription(help)
        .setColor("#6666ff");

      msg.channel.send(embed);
    }
  },
};
