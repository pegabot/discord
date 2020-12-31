/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { Schema } = require("mongoose");

const FrageSchema = new Schema({
  frage: String,
  antworten: [String],
  richtig: Number,
  eingabe: Number,
});

exports.schema = FrageSchema;
