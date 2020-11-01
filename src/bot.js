/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();
const Discord = require("discord.js");
const mongoose = require("mongoose");

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

const { Database } = require("./managers/database");
const { connection, models } = new Database(mongoose);
bot.db = connection;
bot.models = models;

bot.login(bot.config.apiToken);
