/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";

export interface IVoucher extends Document {
  code: string;
  used: boolean;
  _session: Schema.Types.ObjectId;
}

const VoucherSchema = new Schema({
  code: String,
  used: { type: Boolean, default: false },
  _session: { type: Schema.Types.ObjectId, ref: "session" },
});

export const VoucherModel = setModel<IVoucher>("voucher", VoucherSchema);

export interface IFrage {
  frage: string;
  antworten: string[];
  richtig: number;
  eingabe?: number;
}

const FrageSchema = new Schema({
  frage: String,
  antworten: [String],
  richtig: Number,
  eingabe: Number,
});

export interface IQuizSet extends Document {
  name: string;
  fragen: IFrage[];
}

const QuizSetSchema = new Schema({
  name: String,
  fragen: [FrageSchema],
});

export const QuizModel = setModel<IQuizSet>("quiz", QuizSetSchema);

export interface IQuizSession extends Document {
  date: Date;
  expires: number;
  userId: string;
  quiz: IQuizSet;
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
  quiz: QuizSetSchema,
  status: String,
  timedOut: { type: Boolean, default: false },
  fragen: [FrageSchema],
  falscheAntworten: [FrageSchema],
  won: { type: Boolean, default: false },
  shipped: { type: Boolean, default: false },
  voucher: VoucherSchema,
});

export const SessionModel = setModel<IQuizSession>("session", SessionSchema);
