/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";

export interface IReplaceBlogLinks extends Document {
  channelID: string;
  messageID: string;
  rawURL: string;
  seoURL: string;
}

const ReplaceBlogLinksSchema = new Schema({
  channelID: String,
  messageID: String,
  rawURL: String,
  seoURL: String,
});

export const ReplaceBlogLinksModel = setModel<IReplaceBlogLinks>(path.basename(__filename).split(".js")[0], ReplaceBlogLinksSchema);
