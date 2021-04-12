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
  config = process.env;
  client: Client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
  blacklist: Collection<string, string> = new Collection();

  colors: ColorTypes = colors;
  reactions: ReactionTypes = reactions;

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
}
