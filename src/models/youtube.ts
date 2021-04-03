/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { model as setModel, Schema } from "mongoose";
import * as path from "path";

const YouTubeSchema = new Schema({
  created: { type: Number, default: Date.now },
  video_id: { type: String, unique: true },
});

export const YouTubeModel = setModel(path.basename(__filename).split(".js")[0], YouTubeSchema);
