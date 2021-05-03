/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Collection, Message, MessageEmbed, PermissionResolvable } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { Bot } from "../classes/bot";
import { Command } from "../classes/command";
import { emojis } from "../constants/emojis";
import { ILogCommand, LogModel } from "../models/log";
import { BotExecption } from "../utils/execptions";
import { cloneClass } from "../utils/cloneClass";
import { isProduction } from "../utils/environment";
import { findCommand } from "../utils/findCommand";
import { walkSync } from "../utils/walkSync";

export class CommandHandler {
  cmds: Collection<string, Command> = new Collection();
  constructor(protected bot: Bot) {}

  get names() {
    return [...this.cmds.keys()];
  }

  get size() {
    return this.cmds.size;
  }

  get all() {
    return this.cmds;
  }

  get(command: string): Command | undefined {
    return this.cmds.get(command);
  }

  has(command: string): boolean {
    return this.cmds.has(command);
  }

  delete(command: string): boolean {
    return this.cmds.delete(command);
  }

  loadCommands(): void {
    const commands = fs.readdirSync(path.join(__dirname, "..", "commands"));
    const files = walkSync(commands, path.join(__dirname, "..", "commands"));
    for (const command of files) {
      const category = path.dirname(command).split(path.sep).pop() || [];

      const importedCommand: any = require(command);
      const cmd: Command = importedCommand[Object.keys(importedCommand)[0]];

      if (!cmd) continue;
      this.loadCommand(cmd, (category as string) || "-");
    }
  }

  checkCommand(name: string): string | undefined {
    if (this.cmds.has(name)) return `Der Command ${name} existiert bereits.`;
  }

  loadCommand(importedCommand: Command, category: string) {
    const _cmd: any = importedCommand;
    const cmd = new _cmd(this.bot);

    cmd.category = (category[0] || "").toUpperCase() + category.slice(1);

    const { name } = cmd;
    const error = this.checkCommand(name);

    if (!error) {
      this.cmds.set(name.toLowerCase(), cmd);
    } else {
      this.bot.logger.error(error);
    }
  }

  async handleCommand(msg: Message): Promise<void | Message> {
    const guild = this.bot.client.guilds.cache.get(this.bot.config.guildId || "");
    if (!guild) return;

    const { name } = guild;

    if (!msg.guild && msg.author.id !== this.bot.client.user?.id && msg.content.includes(this.bot.config.prefix || "")) {
      msg.channel.send(`Ich darf mit dir leider nicht privat schreiben.. schreib mich doch auf dem **${name}** Server an :smile:`);
      return;
    }

    const args = msg.content.slice(this.bot.config.prefix?.length).trim().split(" ");
    const base = args?.shift()?.toLowerCase();

    if (
      msg.mentions.users
        .array()
        .map((elt) => elt.id)
        .includes(this.bot.client.user?.id || "")
    ) {
      await msg.react(emojis.hugEmoji);
    }

    if (!msg.content.startsWith(this.bot.config.prefix || "")) return;

    if (!base) return msg.reply("du hast keinen Command Namen mit übergeben!");

    const command = findCommand(this.cmds, base);

    if (command) {
      const entry = new LogModel();
      const c: ILogCommand = cloneClass(command);
      delete c.bot;

      entry.command = c;
      entry.author = JSON.parse(JSON.stringify(msg.author));
      entry.save();

      command.bot = this.bot;

      if (this.bot.blacklist.has(msg.author.id)) return;

      if (
        command?.owner &&
        !(this.bot.config.ownerIds || "")
          .split(",")
          .map((elt) => elt.trim())
          .includes(msg.author.id)
      ) {
        return msg.channel.send(":x: Sorry, nur der Besitzer kann diesen Command ausführen.");
      }

      if (isProduction() && command?.disabled) return msg.channel.send(":x: Dieser Command wurde vorübergehend deaktiviert.");

      if (command.channel && isProduction() && msg.channel.id !== this.bot.config.adminChannel) {
        if (!command?.channel.includes(msg.channel.id)) return msg.channel.send(`:x: Dieser Command funktioniert nur in <#${command.channel.join(`>, <#`)}>.`);
      }

      if (command.unlock && isProduction() && msg.channel.id !== this.bot.config.adminChannel) {
        const localTime = new Date().getTime();

        if (localTime < command.unlock)
          return msg.channel.send(
            `:hourglass_flowing_sand: Dieser Command wird erst an folgendem Zeitpunkt freigeschaltet: ***${new Date(command.unlock).toLocaleString(
              "de-DE",
            )}***.`,
          );
      }

      if (command.lock && isProduction() && msg.channel.id !== this.bot.config.adminChannel) {
        const localTime = new Date().getTime();

        if (localTime > command.lock) return msg.channel.send(`:hourglass_flowing_sand: Dieser Command ist nicht mehr verfügbar!.`);
      }

      if (command.permissions && command.permissions.some((e: string) => !msg.member?.hasPermission(e as PermissionResolvable))) {
        return msg.channel.send(":x: Sorry, du besitzt nicht die Berechtigung diesen Command auszuführen.");
      }

      const roles = command?.roles;
      if (roles) {
        const roleCheck = roles.some((e) => msg.member?.roles.cache.find((role) => role.name.toLowerCase() === e.toLowerCase()));
        if (!roleCheck) return msg.channel.send(":x: Sorry, du besitzt nicht die Berechtigung diesen Command auszuführen.");
      }

      try {
        if (command.repeatable) msg.react(emojis.commandRepeatEmoji);
        await command.execute(msg, args || []);
        if (!isProduction()) msg.react(emojis.commandExecutedEmoji);
      } catch (e) {
        if (e instanceof BotExecption) {
          await msg.channel.send(`:x: ${e.message}`);
        } else {
          const embed = new MessageEmbed()
            .setDescription(
              `<@&${this.bot.config.engineerRole}> Ein Fehler ist aufgetreten beim Verarbeiten vom Command \`${this.bot.config.prefix + command.name}\` von ${
                msg.member
              } in ${msg.channel}`,
            )
            .addField("Fehlermeldung", e.message || "Es ist keine Fehlermeldung vorhanden!");

          this.bot.logger.admin_error_embed(embed);

          await msg.channel.send(`<@${msg.author.id}> beim Verarbeiten deines Commands ist ein Fehler aufgetreten. Die Engineers wurden soeben informiert. 🛠`);
        }
      }
    } else {
      msg.react(emojis.commandNotFoundEmoji);
      msg.channel.send(`:x: Sorry, der Command \`${base}\` wurde nicht gefunden.`);
    }
  }
}
