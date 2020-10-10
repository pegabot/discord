/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { Schema } = require('mongoose');

const TweetSchema = new Schema({
  created: Date,
  id: { type: String, unique: true },
  username: String,
  url: String,
  retweet: Boolean,
});

TweetSchema.set('versionKey', false);

exports.schema = TweetSchema;
