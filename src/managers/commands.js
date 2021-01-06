/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const fs = require("fs");
const path = require("path");
const { Collection, MessageEmbed } = require("discord.js");
const { walkSync, BotExecption } = require("../utils.js");

exports.Commands = class {
  constructor(bot) {
    this.bot = bot;
    this.cmds = new Collection();
  }

  get names() {
    return [...this.cmds.keys()];
  }

  get size() {
    return this.cmds.size;
  }

  get(command) {
    return this.cmds.get(command);
  }

  has(command) {
    return this.cmds.has(command);
  }

  delete(command) {
    return this.cmds.delete(command);
  }

  loadCommands() {
    const commands = fs.readdirSync(path.join(__dirname, "..", "commands"));
    const files = walkSync(commands, path.join(__dirname, "..", "commands"));
    for (const command of files) {
      const base = path.parse(command).name;
      const category = path.dirname(command).split(path.sep).pop();

      const cmd = require(command);
      if (!cmd) continue;
      cmd.category = category[0].toUpperCase() + category.slice(1);
      cmd.path = path.join(".", category, base);

      this.loadCommand(base, cmd);
    }
  }

  checkCommand(cmd, name) {
    if (this.cmds.has(name)) return `Der Command ${name} existiert bereits.`;
    if (!cmd.hasOwnProperty("execute")) return `Der Command ${name} muss eine execute Function besitzen.`;
    if (!cmd.hasOwnProperty("help") || !cmd.hasOwnProperty("usage")) {
      return `Der Command ${name} muss einen help/usage Eintrag besitzen.`;
    }
    return null;
  }

  loadCommand(base, cmd) {
    const name = cmd.name;
    const error = this.checkCommand(cmd, name);

    if (!error) {
      [name, ...(cmd.aliases || [])].map((name) => {
        this.cmds.set(name, cmd);
      });
    } else {
      this.bot.logger.error(error);
    }
  }

  async handleCommand(msg) {
    const guild = this.bot.guilds.cache.get(this.bot.config.guildId);
    const { name } = guild;

    if (this.bot.config.ignoredChannels) {
      if (this.bot.config.ignoredChannels.split(",").includes(msg.channel.id)) return;
    }

    if (!msg.guild && msg.author.id !== this.bot.user.id && msg.content.includes(this.bot.config.prefix)) {
      msg.channel.send(`Ich darf mit dir leider nicht privat schreiben.. schreib mich doch auf dem **${name}** Server an :smile:`);
      return null;
    }

    const args = msg.content.slice(this.bot.config.prefix.length).trim().split(" ");
    const base = args.shift().toLowerCase();

    if (
      msg.mentions.users
        .array()
        .map((elt) => elt.id)
        .includes(this.bot.user.id)
    ) {
      await msg.react("🤗");
    }

    if (!msg.content.startsWith(this.bot.config.prefix)) return null;

    if (!base) return msg.channel.send(":x: du hast kein Command mit übergeben!");

    const command = this.cmds.get(base);

    if (command) {
      const LogModel = this.bot.db.model("log");
      const entry = new LogModel();
      entry.command = command;
      entry.author = JSON.parse(JSON.stringify(msg.author));
      await entry.save();

      if (this.bot.blacklist.has(msg.author.id)) return null;

      if (
        command.owner &&
        !this.bot.config.ownerIds
          .split(",")
          .map((elt) => elt.trim())
          .includes(msg.author.id)
      ) {
        return msg.channel.send(":x: Sorry, nur der Besitzer kann diesen Command ausführen.");
      }

      if (command.disabled) return msg.channel.send(":x: Dieser Command wurde vorübergehend deaktiviert.");

      if (command.channel && process.env.NODE_ENV === "production" && msg.channel.id !== this.bot.config.adminChannel) {
        if (!command.channel.includes(msg.channel.id)) return msg.channel.send(`:x: Dieser Command funktioniert nur in <#${command.channel.join(`>, <#`)}>.`);
      }

      if (command.unlock && process.env.NODE_ENV === "production" && msg.channel.id !== this.bot.config.adminChannel) {
        const localTime = new Date().getTime();

        if (localTime < command.unlock) return msg.channel.send(`:hourglass_flowing_sand: Dieser Command wird erst an folgendem Zeitpunkt freigeschaltet: ***${new Date(command.unlock).toLocaleString("de-DE")}***.`);
      }

      if (command.lock && process.env.NODE_ENV === "production" && msg.channel.id !== this.bot.config.adminChannel) {
        const localTime = new Date().getTime();

        if (localTime > command.lock) return msg.channel.send(`:hourglass_flowing_sand: Dieser Command ist nicht mehr verfügbar!.`);
      }

      const { permissions } = command;
      const { roles } = command;
      if (permissions && permissions.some((e) => !msg.member.hasPermission(e))) {
        return msg.channel.send(":x: Sorry, du besitzt nicht die Berechtigung diesen Command auszuführen.");
      }
      if (roles) {
        const roleCheck = roles.some((e) => msg.member.roles.cache.find((role) => role.name.toLowerCase() === e.toLowerCase()));
        if (!roleCheck) return msg.channel.send(":x: Sorry, du besitzt nicht die Berechtigung diesen Command auszuführen.");
      }

      try {
        await command.execute(this.bot, msg, args);
      } catch (e) {
        if (e instanceof BotExecption) {
          await msg.channel.send(`:x: ${e.message}`);
        } else {
          const embed = new MessageEmbed().setDescription(`Ein Fehler ist aufgetreten beim Verarbeiten eines Commands von ${msg.member} in ${msg.channel}`).addField("Fehlermeldung", e.message ? e.stack : "Es ist keine Fehlermeldung vorhanden!");
          await this.bot.channels.resolve(this.bot.config.errorChannel).send(`<@&${this.bot.config.engineerRole}>`, embed);
          await msg.channel.send(`<@${msg.author.id}> beim Verarbeiten deines Commands ist ein Fehler aufgetreten. Die Engineers wurden soeben informiert. 🛠`);
        }
      }
    } else {
      msg.channel.send(`:x: Sorry, der Command ${base} wurde nicht gefunden.`);
    }
  }
};
