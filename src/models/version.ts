/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";

export interface IVersion extends Document {
  version: String;
}

const VersionSchema = new Schema({
  version: String,
});

export const VersionModel = setModel<IVersion>(path.basename(__filename).split(".js")[0], VersionSchema);
