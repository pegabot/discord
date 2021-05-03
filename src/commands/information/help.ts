/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../classes/command";
import { colors } from "../../constants/colors";
import { CommandExecption } from "../../utils/execptions";
import { findCommand } from "../../utils/findCommand";

export class HelpCommand extends Command {
  name = "help";
  aliases = ["hilfe"];
  usage = ["help", "help <command>"];
  help = "Gibt alle verfügbaren Command oder Informationen zu einem spezifischen Command zurück.";

  execute(msg: Message, args: string[]) {
    if (args.length === 0) {
      const cmdsString = this.bot.commands.names
        .filter((cmd) => !this.bot.commands.get(cmd)?.owner)
        .filter((cmd) => {
          const perms = this.bot.commands.get(cmd)?.permissions;
          if (perms && !perms.every((e: any) => !msg.member?.hasPermission(e))) return true;
          if (!perms) return true;
          return false;
        })
        .filter((cmd) => {
          const roles = this.bot.commands.get(cmd)?.roles;
          if (!roles) return true;
          const roleCheck = roles.some((e) => msg.member?.roles.cache.find((role) => role.name.toLowerCase() === e.toLowerCase()));
          if (roles && roleCheck) {
            return true;
          }
          return false;
        })
        .sort()
        .map(
          (cmd) =>
            `${this.bot.commands.get(cmd)?.disabled ? `${cmd} (deaktiviert)` : cmd}${
              this.bot.commands.get(cmd)?.aliases ? ` (${this.bot.commands?.get(cmd)?.aliases?.join(", ")})` : ""
            }`,
        )
        .map((cmd) => `\`${cmd}\``)
        .join("\n");
      const embed = new MessageEmbed()
        .setAuthor(this.bot.client.user?.tag, this.bot.client.user?.displayAvatarURL())
        .setTitle(`Commands für ${msg.guild?.name}`)
        .setDescription(`**Tip:** verwende ${this.bot.config.prefix}help <command>, um Hilfe für einen spezifischen Command zu erhalten.`)
        .addField("Prefix", this.bot.config.prefix)
        .addField("Verfügbare Commands (Aliase)", cmdsString, true)
        .setColor(colors.blue);

      msg.channel.send(embed);
    } else if (args.length > 0) {
      const command = findCommand(this.bot.commands?.all, args[0]);
      if (!command) throw new CommandExecption(`Der Command ${args[0]} wurde nicht gefunden.`);

      let { aliases, permissions, roles, usage, name, disabled, category, help } = command;
      if (permissions && permissions.some((e: any) => !msg.member?.hasPermission(e)))
        return msg.channel.send("Du versuchst Hilfe für einen Command zu bekommen, für welchen du nicht die Berechtigung besitzt.");

      if (roles) {
        const roleCheck = roles.some((e) => msg.member?.roles.cache.find((role) => role.name.toLowerCase() === e.toLowerCase()));
        if (!roleCheck) return msg.channel.send("Du versuchst Hilfe für einen Command zu bekommen, für welchen du nicht die Berechtigung besitzt.");
      }

      if (Array.isArray(usage)) {
        usage = usage.map((el) => this.bot.config.prefix + el).join("\n");
      } else {
        usage = this.bot.config.prefix + usage;
      }

      const embed = new MessageEmbed()
        .setAuthor(this.bot.client.user?.tag, this.bot.client.user?.displayAvatarURL())
        .setTitle(`Hilfe für **${this.bot.config.prefix}${name} ${disabled ? " (deaktiviert)" : ""}**`)
        .addField("Verwendung(en)", usage, true)
        .addField("Kategorie", category, true)
        .addField("Aliase", aliases ? aliases.join(", ") : "keine", true)
        .addField("Berechtigungen", permissions ? permissions.join("\n") : "keine", true)
        .setDescription(help)
        .setColor(colors.blue);

      msg.channel.send(embed);
    }
  }
}
