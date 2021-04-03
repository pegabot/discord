/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { model as setModel, Schema } from "mongoose";
import * as path from "path";
import { FrageSchema } from "./frage";
import { QuizSchema } from "./quiz";
import { VoucherSchema } from "./voucher";

const SessionSchema = new Schema({
  date: { type: Date, default: Date.now },
  expires: { type: Number },
  userId: String,
  quiz: QuizSchema,
  status: String,
  timedOut: { type: Boolean, default: false },
  fragen: [FrageSchema],
  falscheAntworten: [FrageSchema],
  won: { type: Boolean, default: false },
  shipped: { type: Boolean, default: false },
  voucher: VoucherSchema,
});

export const SessionModel = setModel(path.basename(__filename).split(".js")[0], SessionSchema);
