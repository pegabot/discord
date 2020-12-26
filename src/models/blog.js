/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { Schema } = require("mongoose");

const BlogPostSchema = new Schema({
  created: { type: Number, default: Date.now },
  blogPost_id: { type: String, unique: true },
  url: String,
  raw: Object,
});

exports.schema = BlogPostSchema;
