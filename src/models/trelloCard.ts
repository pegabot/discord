/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { model as setModel, Schema} from "mongoose";
import * as path from "path";

const TrelloCardScheme = new Schema({
  created: { type: Number, default: Date.now },
  cardId: { type: String, unique: true },
  name: String,
  url: String,
  fields: Object,
});

export const TrelloCardModel = setModel(path.basename(__filename).split(".js")[0], TrelloCardScheme);
