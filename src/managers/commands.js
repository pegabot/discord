/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const fs = require("fs");
const path = require("path");
const { Collection, MessageEmbed } = require("discord.js");
const { BotExecption } = require("../utils.js");

class Commands {
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
    const files = this.walkSync(commands, path.join(__dirname, "..", "commands"));
    for (const command of files) {
      const base = path.parse(command).name;
      const category = path.dirname(command).split(path.sep).pop();

      const cmd = require(command);
      if (!cmd.info) continue;
      cmd.info.category = category[0].toUpperCase() + category.slice(1);
      cmd.path = path.join(".", category, base);

      this.loadCommand(base, cmd);
    }
  }

  walkSync(files, fileDir, fileList = []) {
    for (const file of files) {
      const absolutePath = path.join(fileDir, file);
      if (fs.statSync(absolutePath).isDirectory()) {
        const dir = fs.readdirSync(absolutePath);
        this.walkSync(dir, absolutePath, fileList);
      } else {
        if (!absolutePath.includes(".js")) continue;
        fileList.push(path.relative(__dirname, absolutePath));
      }
    }
    return fileList;
  }

  checkCommand(cmd, name) {
    if (this.cmds.has(name)) return `Der Command ${name} existiert bereits.`;
    if (!cmd.hasOwnProperty("info")) return `Der Command ${name} hat kein Info Objekt.`;
    if (!cmd.info.hasOwnProperty("help") || !cmd.info.hasOwnProperty("usage")) {
      return `Der Command ${name} muss einen help/usage Eintrag in seinem Info Objekt besitzen.`;
    }
    return null;
  }

  loadCommand(base, cmd) {
    const name = cmd.info ? cmd.info.name : base;
    const error = this.checkCommand(cmd, name);

    if (!error) {
      this.cmds.set(name, cmd);
    } else {
      this.bot.logger.error(error);
    }
  }

  async handleCommand(msg) {
    const guild = this.bot.guilds.cache.get(this.bot.config.guildId);
    const { name } = guild;

    if (!msg.guild && msg.author.id !== this.bot.user.id) {
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
      msg.react("🤗");
    }

    if (!msg.content.startsWith(this.bot.config.prefix)) return null;

    if (!base) return msg.channel.send(":x: du hast kein Command mit übergeben!");
    if (this.bot.blacklist.has(msg.author.id)) return null;

    const command = this.cmds.get(base);
    if (command) {
      if (
        command.info.owner &&
        !this.bot.config.ownerIds
          .split(",")
          .map((elt) => elt.trim())
          .includes(msg.author.id)
      ) {
        return msg.channel.send(":x: Sorry, nur der Besitzer kann diesen Command ausführen.");
      }

      if (command.info.disabled) return msg.channel.send(":x: Dieser Command wurde vorübergehend deaktiviert.");

      const { permissions } = command.info;
      const { roles } = command.info;
      if (permissions && permissions.some((e) => !msg.member.hasPermission(e))) {
        return msg.channel.send(":x: Sorry, du besitzt nicht die Berechtigung diesen Command auszuführen.");
      }
      if (roles) {
        const roleCheck = roles.some((e) => msg.member.roles.cache.find((role) => role.name.toLowerCase() === e.toLowerCase()));
        if (!roleCheck) return msg.channel.send(":x: Sorry, du besitzt nicht die Berechtigung diesen Command auszuführen.");
      }

      try {
        await command.run(this.bot, msg, args);
      } catch (e) {
        if (e instanceof BotExecption) {
          await msg.channel.send(`:x: ${e.message}`);
        } else {
          const embed = new MessageEmbed()
            .setDescription(`Ein Fehler ist aufgetreten beim Verarbeiten eines Commands von ${msg.member} in ${msg.channel}`)
            .addField("Fehlermeldung", e.message ? e.message : "Es ist keine Fehlermeldung vorhanden!");
          await this.bot.channels.resolve(this.bot.config.errorChannel).send(`<@&${this.bot.config.engineerRole}>`, embed);
          await msg.channel.send(`<@${msg.author.id}> beim Verarbeiten deines Commands ist ein Fehler aufgetreten. Die Engineers wurden soeben informiert. 🛠`);
        }
      }
    } else {
      msg.channel.send(`:x: Sorry, der Command ${base} wurde nicht gefunden.`);
    }
  }
}

module.exports = Commands;
