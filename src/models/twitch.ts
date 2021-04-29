/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";

export interface ITwitch extends Document {
  name: string;
}

const TwitchSchema = new Schema({
  name: String,
});

export const TwitchModel = setModel<ITwitch>(path.basename(__filename).split(".js")[0], TwitchSchema);
