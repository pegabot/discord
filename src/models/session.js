/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
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
  fragen: [FrageSchema],
  won: { type: Boolean, default: false },
  shipped: { type: Boolean, default: false },
  voucher: VoucherSchema,
});

exports.schema = SessionSchema;
