/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";

export interface ITweet extends Document {
  created: Date;
  id: string;
  username: string;
  url: string;
  retweet: boolean;
}

const TweetSchema = new Schema({
  created: Date,
  id: { type: String, unique: true },
  username: String,
  url: String,
  retweet: Boolean,
});

export const TweetModel = setModel<ITweet>(path.basename(__filename).split(".js")[0], TweetSchema);
