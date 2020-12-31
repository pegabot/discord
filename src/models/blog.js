/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { Schema } = require("mongoose");

const BlogPostSchema = new Schema({
  created: { type: Number, default: Date.now },
  blogPost_id: { type: String, unique: true },
  url: String,
  raw: Object,
});

exports.schema = BlogPostSchema;
