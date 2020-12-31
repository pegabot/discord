/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { Schema } = require("mongoose");

const YouTubeSchema = new Schema({
  created: { type: Number, default: Date.now },
  video_id: { type: String, unique: true },
});

exports.schema = YouTubeSchema;
