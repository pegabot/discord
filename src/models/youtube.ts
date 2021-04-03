/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";

export interface IYouTube extends Document {
  created: number;
  video_id: string;
}

const YouTubeSchema = new Schema({
  created: { type: Number, default: Date.now },
  video_id: { type: String, unique: true },
});

export const YouTubeModel = setModel<IYouTube>(path.basename(__filename).split(".js")[0], YouTubeSchema);
