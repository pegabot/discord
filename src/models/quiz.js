/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { Schema } = require("mongoose");
const { schema: FrageSchema } = require("./frage");

const QuizSchema = new Schema({
  name: String,
  fragen: [FrageSchema],
});

exports.schema = QuizSchema;
