/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { Schema } = require("mongoose");

const FrageSchema = new Schema({
  frage: String,
  antworten: [String],
  richtig: Number,
  eingabe: Number,
});

exports.schema = FrageSchema;
