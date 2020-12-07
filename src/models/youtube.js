/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { Schema } = require("mongoose");

const YouTubeSchema = new Schema({
  created: Date,
  video_id: { type: String, unique: true },
});

exports.schema = YouTubeSchema;
