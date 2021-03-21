/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

require("dotenv").config();

require("./server/server");

const Discord = require("discord.js");

const bot = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

bot.config = process.env;
bot.blacklist = new Discord.Collection();

const colors = require("../colors.json");
bot.colors = colors;

const globals = require("../globals.json");
bot.globals = globals;

const { Logger } = require("./managers/logger");
bot.logger = new Logger(bot);

const { Database } = require("./managers/database");
const { instance } = new Database();
bot.db = instance;

const { Commands } = require("./managers/commands");
bot.commands = new Commands(bot);

const { Jobs } = require("./managers/jobs");
bot.jobs = new Jobs(bot);

const { Jukebox } = require("./managers/jukebox");
bot.jukebox = new Jukebox(bot);

const { Events } = require("./managers/events");
bot.events = new Events(bot);
bot.events.loadEvents();

bot.login(bot.config.apiToken);

exports.bot = bot;
