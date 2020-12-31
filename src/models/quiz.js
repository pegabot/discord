/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { Schema } = require("mongoose");
const { schema: FrageSchema } = require("./frage");

const QuizSchema = new Schema({
  name: String,
  fragen: [FrageSchema],
});

exports.schema = QuizSchema;
