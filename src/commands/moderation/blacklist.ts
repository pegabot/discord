/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../classes/command";
import { CommandExecption } from "../../utils/execptions";
import { resolveUser } from "../../utils/resolveUser";

export class BlacklistCommand extends Command {
  name = "blacklist";
  usage = ["blacklist", "blacklist add <user>", "blacklist remove <user>"];
  help = "Fügt Benutzer zu einer Blacklist hinzu, die ihn von der Benutzung dieses Bots ausschließt.";
  permissions = ["BAN_MEMBERS"];
  repeatable = false;

  execute(msg: Message, args: string[]) {
    if (args.length === 0) {
      const list = this.bot?.blacklist
        ?.keyArray()
        .map((user) => `- ${this.bot?.blacklist?.get(user)} (${user})`)
        .join("\n");
      const embed = new MessageEmbed()
        .setTitle("Die Blacklist")
        .setDescription("Eine Liste mit Benutzer, die von der Verwendung dieses Bots ausgeschlossen sind.")
        .addField("Liste", list?.length !== 0 ? list : "Aktuell befinden sich keine Benutzer auf der Blacklist.");
      msg.channel.send(embed);
    } else if (args[0] === "add") {
      if (!args[1]) throw new CommandExecption("Bitte übergebe einen Benutzer, der zur Blacklist hinzugefügt werden soll.");

      const user = resolveUser(msg, args[1]);
      if (user?.id === msg.author.id) throw new CommandExecption(`Du kannst dich selbst nicht auf die Blacklist setzen!`);

      if (user) {
        this.bot?.blacklist?.set(user.id, user.user.username);
        msg.channel.send(`Der Benutzer ${user.user.username} wurde erfolgreich zur Blacklist hinzugefügt.`);
      } else {
        throw new CommandExecption(`Der Benutzer ${args[1]} wurde nicht gefunden.`);
      }
    } else if (args[0] === "remove") {
      if (!args[1]) throw new CommandExecption("Bitte übergebe einen Benutzer, der von der Blacklist entfernt werden soll.");

      const user = resolveUser(msg, args[1]);
      if (user) {
        if (this.bot?.blacklist?.has(user.id)) {
          this.bot.blacklist.delete(user.id);
          msg.channel.send(`Der Benutzer ${user.user.username} wurde erfolgreich von der Blacklist entfernt.`);
        } else {
          throw new CommandExecption(`Der Benutzer ${user.user.username} befindet sich nicht auf der Blacklist.`);
        }
      }
    } else {
      throw new CommandExecption("Bitte übergebe einen validen Subcommand.");
    }
  }
}
