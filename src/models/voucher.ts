/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { model as setModel, Schema} from "mongoose";
import * as path from "path";

export const VoucherSchema = new Schema({
  code: String,
  used: { type: Boolean, default: false },
  _session: { type: Schema.Types.ObjectId, ref: "session" },
});

export const VoucherModel = setModel(path.basename(__filename).split(".js")[0], VoucherSchema);
