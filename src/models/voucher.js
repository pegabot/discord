/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { Schema } = require("mongoose");

const VoucherSchema = new Schema({
  code: String,
  used: { type: Boolean, default: false },
  _session: { type: Schema.ObjectId, ref: "session" },
});

exports.schema = VoucherSchema;
