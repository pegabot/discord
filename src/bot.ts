/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Client, Collection } from "discord.js";
import { config } from "dotenv";
import * as colors from "../colors.json";
import * as reactions from "../reactions.json";
import { CommandHandler } from "./handler/commands";
import { MongoConnector } from "./handler/database";
import { EventHandler } from "./handler/events";
import { JobHandler } from "./handler/jobs";
import { LogHandler } from "./handler/log";
import { server } from "./server/server";
import { BotType } from "./types/bot";
config();

server.listen(process.env.PORT || 80, () => console.log(`💻 Webserver gestartet!`));

const bot: BotType = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

bot.config = process.env;
bot.blacklist = new Collection();

bot.colors = colors;

bot.reactions = reactions;

bot.logger = new LogHandler(bot);

const database = new MongoConnector();
bot.MongoConnector = database;
bot.db = database.connection;

bot.commands = new CommandHandler(bot);

bot.jobs = new JobHandler(bot);

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
