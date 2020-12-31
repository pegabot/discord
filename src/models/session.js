/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { Schema } = require("mongoose");
const { schema: FrageSchema } = require("./frage");
const { schema: QuizSchema } = require("./quiz");
const { schema: VoucherSchema } = require("./voucher");

const SessionSchema = new Schema({
  created: { type: Number, default: Date.now },
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

exports.schema = SessionSchema;
