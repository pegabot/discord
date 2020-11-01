/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();
const Discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const bot = new Discord.Client();

const config = process.env;
bot.config = config;

const { Commands } = require("./managers/commands");
const { Functions } = require("./managers/functions");
const { Logger } = require("./managers/logger");

bot.commands = new Commands(bot);
bot.functions = new Functions(bot);
bot.logger = new Logger();

bot.events = [];

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

bot.login(config.apiToken);
