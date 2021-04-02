/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { model as setModel, Schema } from "mongoose";
import * as path from "path";

const MessageSchema = new Schema({
  message: Object,
  author: Object,
  channel: Object,
  date: { type: Date, default: Date.now },
});

export const MessageModel = setModel(path.basename(__filename).split(".js")[0], MessageSchema);
