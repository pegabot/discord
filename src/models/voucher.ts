/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";

export interface IVoucher extends Document {
  code: string;
  used: boolean;
  _session: Schema.Types.ObjectId;
}

export const VoucherSchema = new Schema({
  code: String,
  used: { type: Boolean, default: false },
  _session: { type: Schema.Types.ObjectId, ref: "session" },
});

export const VoucherModel = setModel<IVoucher>(path.basename(__filename).split(".js")[0], VoucherSchema);
