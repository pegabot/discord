/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { ChatClient } from "dank-twitch-irc";
import { Client, Collection } from "discord.js";
import { config } from "dotenv";
import * as colors from "../../colors.json";
import * as reactions from "../../reactions.json";
import { CommandHandler } from "../handler/commands";
import { MongoConnector } from "../handler/database";
import { EventHandler } from "../handler/events";
import { JobHandler } from "../handler/jobs";
import { LogHandler } from "../handler/log";
import { ColorTypes } from "../types/colors";
import { ReactionTypes } from "../types/reactions";

config();

export class Bot {
  config: NodeJS.ProcessEnv;
  client: Client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
  blacklist: Collection<string, string> = new Collection();

  colors: ColorTypes = colors;
  reactions: ReactionTypes = reactions;

  MongoConnector: MongoConnector;
  db: typeof import("mongoose") | undefined;

  logger: LogHandler;

  jobs: JobHandler;
  events: EventHandler;
  commands: CommandHandler;

  twitchClient?: ChatClient;

  constructor() {
    this.config = process.env;

    this.MongoConnector = new MongoConnector();
    this.db = this.MongoConnector.connection;

    this.logger = new LogHandler(this);

    this.jobs = new JobHandler(this);
    this.events = new EventHandler(this);
    this.events.loadEvents();

    this.commands = new CommandHandler(this);
  }
}
