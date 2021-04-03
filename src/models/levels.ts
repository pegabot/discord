/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { User } from "discord.js";
import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";

export interface ILevel extends Document {
  userID: string;
  guildID: string;
  xp: number;
  level: number;
  lastUpdated: Date;
  user: User;
}

const LevelSchema = new Schema({
  userID: { type: String },
  guildID: { type: String },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: new Date() },
  user: { type: Object },
});

export const LevelModel = setModel<ILevel>(path.basename(__filename).split(".js")[0], LevelSchema);
