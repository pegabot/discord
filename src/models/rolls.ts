/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";

export interface IRolls extends Document {
  messageId: string;
  dice: string;
  date: Date;
}

const RollsSchema = new Schema({
  messageId: String,
  dice: String,
  date: { type: Date, default: Date.now },
});

export const RollsModel = setModel<IRolls>(path.basename(__filename).split(".js")[0], RollsSchema);
