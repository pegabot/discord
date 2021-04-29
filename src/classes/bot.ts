/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ChatClient } from "dank-twitch-irc";
import { Client, Collection } from "discord.js";
import { config } from "dotenv";
import { CommandHandler } from "../handler/commands";
import { MongoConnector } from "../handler/database";
import { EventHandler } from "../handler/events";
import { JobHandler } from "../handler/jobs";
import { LogHandler } from "../handler/log";

config();

export class Bot {
  config = process.env;
  client: Client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
  blacklist: Collection<string, string> = new Collection();

  MongoConnector = new MongoConnector();
  db: typeof import("mongoose") | undefined = this.MongoConnector.connection;

  logger = new LogHandler(this);

  jobs = new JobHandler(this);
  events = new EventHandler(this);
  commands = new CommandHandler(this);

  twitchClient = new ChatClient({});

  constructor() {
    this.events.loadEvents();
  }

  public destroy(signal?: NodeJS.Signals): void {
    console.log(`${signal || "Signal"} recieved, destroying the bot.`);
    this.twitchClient.close();
    this.client.destroy();
    this.db?.disconnect();
    process.exit(0);
  }
}
