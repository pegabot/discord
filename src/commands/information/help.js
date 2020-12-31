/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");
const { BotExecption } = require("../../utils");

exports.run = (bot, msg, args) => {
  if (args.length === 0) {
    const cmdsString = bot.commands.names
      .filter((cmd) => !bot.commands.get(cmd).info.owner)
      .filter((cmd) => {
        const perms = bot.commands.get(cmd).info.permissions;
        if (perms && !perms.every((e) => !msg.member.hasPermission(e))) return true;
        if (!perms) return true;
        return false;
      })
      .filter((cmd) => {
        const { roles } = bot.commands.get(cmd).info;
        if (!roles) return true;
        const roleCheck = roles.some((e) => msg.member.roles.cache.find((role) => role.name.toLowerCase() === e.toLowerCase()));
        if (roles && roleCheck) {
          return true;
        }
        return false;
      })
      .map((cmd) => (bot.commands.get(cmd).info.disabled ? `${cmd} (deaktiviert)` : cmd))
      .map((cmd) => `\`${cmd}\``)
      .join(", ");
    const embed = new MessageEmbed().setTitle("Hilfe").addField("Verfügbare Commands", cmdsString, true).setDescription(`Tip: verwende ${bot.config.prefix}help <command>, um Hilfe für einen spezifischen Command zu erhalten.`);

    msg.channel.send(embed);
  } else if (args.length > 0) {
    if (!bot.commands.has(args[0])) throw new BotExecption(`Der Command ${args[0]} wurde nicht gefunden.`);

    const { info } = bot.commands.get(args[0]);
    const { permissions } = info;
    const { roles } = info;
    if (permissions && permissions.some((e) => !msg.member.hasPermission(e))) {
      return msg.channel.send("Du versuchst Hilfe für einen Command zu bekommen, für welchen du nicht die Berechtigung besitzt.");
    }
    if (roles) {
      const roleCheck = roles.some((e) => msg.member.roles.cache.find((role) => role.name.toLowerCase() === e.toLowerCase()));
      if (!roleCheck) return msg.channel.send("Du versuchst Hilfe für einen Command zu bekommen, für welchen du nicht die Berechtigung besitzt.");
    }

    let { usage } = info;
    if (Array.isArray(info.usage)) {
      usage = info.usage.map((el) => bot.config.prefix + el).join("\n");
    } else {
      usage = bot.config.prefix + usage;
    }

    const embed = new MessageEmbed()
      .setTitle(`Hilfe für **${bot.config.prefix}${info.name} ${info.disabled ? " (deaktiviert)" : ""}**`)
      .addField("Verwendung(en)", usage, true)
      .addField("Kategorie", info.category, true)
      .setDescription(info.help);

    msg.channel.send(embed);
  }
};

exports.info = {
  name: "help",
  usage: ["help", "help <command>"],
  help: "Gibt alle verfügbaren Command oder Informationen zu einem spezifischen Command zurück.",
};
