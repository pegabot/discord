/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { config } from "dotenv";
config();

import { server } from "./server/server";
server.listen(process.env.PORT || 80, () => console.log(`💻 Webserver gestartet!`));

import { BotType } from "./types/bot";

import { Collection, Client } from "discord.js";
const bot: BotType = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

bot.config = process.env;
bot.blacklist = new Collection();

import * as colors from "../colors.json";
bot.colors = colors;

import * as reactions from "../reactions.json";
bot.reactions = reactions;

import { LogHandler } from "./handler/log";
bot.logger = new LogHandler(bot);

import { MongoConnector } from "./handler/database";
const database = new MongoConnector();
bot.MongoConnector = database;
bot.db = database.connection;

import { CommandHandler } from "./handler/commands";
bot.commands = new CommandHandler(bot);

import { JobHandler } from "./handler/jobs";
bot.jobs = new JobHandler(bot);

import { EventHandler } from "./handler/events";
bot.events = new EventHandler(bot);
bot.events.loadEvents();

bot.login(bot.config.apiToken);

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");

  bot.twitchClient?.close();
  bot.destroy();

  process.exit(0);
});

export default bot;
