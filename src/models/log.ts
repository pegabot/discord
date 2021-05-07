/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { User } from "discord.js";
import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";
import { Bot } from "../core/bot";
import { Command } from "../core/commands/command";

export interface ILogCommand extends Omit<Command, "bot"> {
  bot: Bot | undefined;
}

export interface ILog extends Document {
  created: number;
  command: ILogCommand;
  author: User;
}

const LogSchema = new Schema({
  created: { type: Number, default: Date.now },
  command: Object,
  author: Object,
});

export const LogModel = setModel<ILog>(path.basename(__filename).split(".js")[0], LogSchema);
