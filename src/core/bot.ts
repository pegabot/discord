/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ChatClient } from "dank-twitch-irc";
import { Client, Collection, Intents } from "discord.js";
import { config } from "dotenv";
import { CustomClient } from "../types/discord";
import { CommandHandler } from "./commands/commandHandler";
import { MongoConnector } from "./databases/mongodb";
import { RedisConnector } from "./databases/redis";
import { EventHandler } from "./events/eventHandler";
import { interactionHandler } from "./interactions/interactionHandler.js";
import { JobHandler } from "./jobs/jobHandler";
import { LogHandler } from "./log";
config();

export class Bot {
  config = process.env;
  client: CustomClient = new Client({ intents: new Intents(Intents.ALL), partials: ["MESSAGE", "CHANNEL", "REACTION"] });
  blacklist: Collection<string, string> = new Collection();

  MongoConnector = new MongoConnector();
  db: typeof import("mongoose") | undefined = this.MongoConnector.connection;
  redis = new RedisConnector();

  logger = new LogHandler(this);

  jobs = new JobHandler(this);
  events = new EventHandler(this);
  commands = new CommandHandler(this);
  interactions = new interactionHandler(this);

  twitchClient = new ChatClient({});

  constructor() {
    this.events.loadEvents();
    this.seedConfiguration();
  }

  private seedConfiguration(): void {
    if (!process.env.NODE_ENV) {
      this.logger.console("The environmental variable 'NODE_ENV' was not set. Defaulting to 'production'");
      this.config.NODE_ENV = "production";
    }
  }

  public async destroy(signal?: NodeJS.Signals): Promise<void> {
    console.log(`${signal || "Exit signal"} recieved, destroying the bot.`);

    this.twitchClient.close();
    this.client.destroy();
    await this.db?.disconnect();
    this.redis.client.end();
    console.log("Stopping process");
    process.exit(0);
  }
}
