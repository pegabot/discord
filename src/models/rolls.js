/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { Schema } = require("mongoose");

const RollsSchema = new Schema({
  messageId: String,
  dice: String,
  date: { type: Date, default: Date.now },
});

exports.schema = RollsSchema;
