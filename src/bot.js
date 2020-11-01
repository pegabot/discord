/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();
const Discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const bot = new Discord.Client();

bot.config = process.env;
bot.blacklist = new Discord.Collection();

const { Logger } = require("./managers/logger");
bot.logger = new Logger();

const { Commands } = require("./managers/commands");
bot.commands = new Commands(bot);

const { Functions } = require("./managers/functions");
bot.functions = new Functions(bot);

const { Events } = require("./managers/events");
bot.events = new Events(bot);
bot.events.loadEvents();

const models = fs.readdirSync(path.join(__dirname, "models"));
for (const model of models) {
  const name = model.split(".")[0];
  if (/\w?#.+/.test(name)) continue;

  const module = require(path.join(__dirname, "models", name));
  mongoose.model(name, module.schema);
}

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoIndex: true, useFindAndModify: false });
bot.db = mongoose;

bot.login(bot.config.apiToken);
