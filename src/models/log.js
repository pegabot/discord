/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { Schema } = require("mongoose");

const LogSchema = new Schema({
  created: { type: Number, default: Date.now },
  command: Object,
  author: Object,
});

exports.schema = LogSchema;
