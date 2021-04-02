/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { model as setModel, Schema } from "mongoose";
import * as path from "path";

const BlogPostSchema = new Schema({
  created: { type: Number, default: Date.now },
  blogPost_id: { type: String, unique: true },
  url: String,
  raw: Object,
});

export const BlogPostModel = setModel(path.basename(__filename).split(".js")[0], BlogPostSchema);
