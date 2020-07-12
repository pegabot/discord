require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const Commands = require("./managers/commands");
const Logger = require("./managers/logger");

const bot = new Discord.Client();
const config = process.env;

bot.config = config;
bot.commands = new Commands(bot);
bot.logger = new Logger();
bot.blacklist = new Discord.Collection();

const events = fs.readdirSync(path.join(__dirname, "events"));
for (const event of events) {
  const name = event.split(".")[0];
  const eventFunc = require(path.join(__dirname, "events", name));
  bot.on(name, (...args) => eventFunc.run(bot, ...args));
}

const funcs = fs.readdirSync(path.join(__dirname, "functions"));
for (const func of funcs) {
  const name = func.split(".")[0];
  const funcFunc = require(path.join(__dirname, "functions", name));
  funcFunc.run(bot);
}
bot.login(config.BOT_TOKEN);
