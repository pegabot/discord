/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();
const Discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Commands = require("./managers/commands");
const Logger = require("./managers/logger");

const bot = new Discord.Client();
const config = process.env;

bot.config = config;
bot.commands = new Commands(bot);
bot.events = [];
bot.functions = [];
bot.logger = new Logger();
bot.blacklist = new Discord.Collection();

const models = fs.readdirSync(path.join(__dirname, "models"));
for (const model of models) {
  const name = model.split(".")[0];
  if (/\w?#.+/.test(name)) continue;

  const module = require(path.join(__dirname, "models", name));
  mongoose.model(name, module.schema);
}

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoIndex: true, useFindAndModify: false });
bot.db = mongoose;

const events = fs.readdirSync(path.join(__dirname, "events"));
for (const event of events) {
  const name = event.split(".")[0];
  if (/\w?#.+/.test(name)) continue;

  const module = require(path.join(__dirname, "events", name));
  if (module.disable) continue;

  bot.events.push(module);
  bot.on(name, (...args) => module.run(bot, ...args));
}

const funcs = fs.readdirSync(path.join(__dirname, "functions"));
for (const func of funcs) {
  const name = func.split(".")[0];
  if (/\w?#.+/.test(name)) continue;

  const module = require(path.join(__dirname, "functions", name));
  if (module.info.env && process.env[`enable_${module.info.env}`] !== "true") continue;

  bot.functions.push(module);
  if (module.setup) module.setup(bot);
  if (module.info.interval) {
    setInterval(() => {
      module.run(bot);
    }, module.info.interval);
  } else {
    module.run(bot);
  }
}
bot.login(config.apiToken);
