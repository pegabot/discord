/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { Schema } = require("mongoose");

const TweetSchema = new Schema({
  created: Date,
  id: { type: String, unique: true },
  username: String,
  url: String,
  retweet: Boolean,
});

exports.schema = TweetSchema;
