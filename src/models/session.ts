/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";
import { FrageSchema, IFrage } from "./frage";
import { IQuiz, QuizSchema } from "./quiz";
import { IVoucher, VoucherSchema } from "./voucher";

export interface ISession extends Document {
  date: Date;
  expires: number;
  userId: string;
  quiz: IQuiz;
  status: string;
  timedOut: boolean;
  fragen: IFrage[];
  falscheAntworten: IFrage[];
  won: boolean;
  shipped: boolean;
  voucher: IVoucher;
}

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

export const SessionModel = setModel<ISession>(path.basename(__filename).split(".js")[0], SessionSchema);
