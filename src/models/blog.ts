/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";

export interface IBlogPost extends Document {
  created: number;
  blogPost_id: string;
  url: string;
  raw: Object;
}

const BlogPostSchema = new Schema({
  created: { type: Number, default: Date.now },
  blogPost_id: { type: String, unique: true },
  url: String,
  raw: Object,
});

export const BlogPostModel = setModel<IBlogPost>(path.basename(__filename).split(".js")[0], BlogPostSchema);
