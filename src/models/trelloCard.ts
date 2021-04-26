/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";

export interface ITrelloCard extends Document {
  created: number;
  cardId: string;
  name: string;
  url: string;
  fields: Object;
}

const TrelloCardScheme = new Schema({
  created: { type: Number, default: Date.now },
  cardId: { type: String, unique: true },
  name: String,
  url: String,
  fields: Object,
});

export const TrelloCardModel = setModel<ITrelloCard>(path.basename(__filename).split(".js")[0], TrelloCardScheme);
