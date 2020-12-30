/*
 * Copyright (c) 2020 - 2021 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { Schema } = require("mongoose");

const YouTubeSchema = new Schema({
  created: { type: Number, default: Date.now },
  video_id: { type: String, unique: true },
});

exports.schema = YouTubeSchema;
