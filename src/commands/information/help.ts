/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message, MessageEmbed } from "discord.js";
import { BotCommand } from "../../classes/command";
import { BotExecption } from "../../utils/BotExecption";
import { findCommand } from "../../utils/findCommand";

export class HelpCommand extends BotCommand {
  name = "help";
  aliases = ["hilfe"];
  usage = ["help", "help <command>"];
  help = "Gibt alle verfügbaren Command oder Informationen zu einem spezifischen Command zurück.";

  execute(msg: Message, args: string[]): void {
    if (args.length === 0) {
      const cmdsString = this.bot?.commands?.names
        .filter((cmd) => !this.bot?.commands?.get(cmd)?.owner)
        .filter((cmd) => {
          const perms = this.bot?.commands?.get(cmd)?.permissions;
          if (perms && !perms.every((e: any) => !msg.member?.hasPermission(e))) return true;
          if (!perms) return true;
          return false;
        })
        .filter((cmd) => {
          const roles = this.bot?.commands?.get(cmd)?.roles;
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
            `${this.bot?.commands?.get(cmd)?.disabled ? `${cmd} (deaktiviert)` : cmd}${
              this.bot?.commands?.get(cmd)?.aliases ? ` (${this.bot?.commands?.get(cmd)?.aliases?.join(", ")})` : ""
            }`,
        )
        .map((cmd) => `\`${cmd}\``)
        .join("\n");
      const embed = new MessageEmbed()
        .setAuthor(this.bot?.user?.tag, this.bot?.user?.displayAvatarURL())
        .setTitle(`Commands für ${msg.guild?.name}`)
        .setDescription(`**Tip:** verwende ${this.bot?.config?.prefix}help <command>, um Hilfe für einen spezifischen Command zu erhalten.`)
        .addField("Prefix", this.bot?.config?.prefix)
        .addField("Verfügbare Commands (Aliase)", cmdsString, true)
        .setColor(this.bot?.colors?.blue || "");

      msg.channel.send(embed);
    } else if (args.length > 0) {
      const command = findCommand(this.bot?.commands?.all, args[0]);
      if (!command) throw new BotExecption(`Der Command ${args[0]} wurde nicht gefunden.`);

      let { aliases, permissions, roles, usage, name, disabled, category, help } = command;
      if (permissions && permissions.some((e: any) => !msg.member?.hasPermission(e))) {
        msg.channel.send("Du versuchst Hilfe für einen Command zu bekommen, für welchen du nicht die Berechtigung besitzt.");
        return;
      }
      if (roles) {
        const roleCheck = roles.some((e) => msg.member?.roles.cache.find((role) => role.name.toLowerCase() === e.toLowerCase()));
        if (!roleCheck) {
          msg.channel.send("Du versuchst Hilfe für einen Command zu bekommen, für welchen du nicht die Berechtigung besitzt.");
          return;
        }
      }

      if (Array.isArray(usage)) {
        usage = usage.map((el) => this.bot?.config?.prefix + el).join("\n");
      } else {
        usage = this.bot?.config?.prefix + usage;
      }

      const embed = new MessageEmbed()
        .setAuthor(this.bot?.user?.tag, this.bot?.user?.displayAvatarURL())
        .setTitle(`Hilfe für **${this.bot?.config?.prefix}${name} ${disabled ? " (deaktiviert)" : ""}**`)
        .addField("Verwendung(en)", usage, true)
        .addField("Kategorie", category, true)
        .addField("Aliase", aliases ? aliases.join(", ") : "keine", true)
        .addField("Berechtigungen", permissions ? permissions.join("\n") : "keine", true)
        .setDescription(help)
        .setColor(this.bot?.colors?.blue || "");

      msg.channel.send(embed);
    }
  }
}
