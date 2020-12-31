/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { Schema } = require("mongoose");

const VoucherSchema = new Schema({
  code: String,
  used: { type: Boolean, default: false },
  _session: { type: Schema.ObjectId, ref: "session" },
});

exports.schema = VoucherSchema;
