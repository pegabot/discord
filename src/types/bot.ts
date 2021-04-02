/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Collection, Client } from "discord.js";
import { CommandHandler } from "../handler/commands";
import { MongoConnector } from "../handler/database";
import { EventHandler } from "../handler/events";
import { LogHandler } from "../handler/log";
import { ColorTypes } from "./colors";
import { ReactionTypes } from "./reactions";

export interface BotType extends Client {
  config?: NodeJS.ProcessEnv;
  blacklist?: Collection<any, any>;
  colors?: ColorTypes;
  reactions?: ReactionTypes;
  logger?: LogHandler;
  MongoConnector?: MongoConnector;
  db?: typeof import("mongoose");
  commands?: CommandHandler;
  events?: EventHandler;
}
