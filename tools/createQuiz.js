/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const { schema: QuizSchema } = require("../src/models/quiz");

const filename = "quiz.json";
const QuizName = "SPIEL.digital";

(async () => {
  if (!fs.existsSync(path.join(__dirname, filename))) throw new Error(`${filename} existiert nicht!`);
  const questions = require(path.join(__dirname, filename));

  await mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoIndex: true, useFindAndModify: false });
  const QuizModel = mongoose.model("quiz", QuizSchema);

  const ModelQuestion = new QuizModel();
  ModelQuestion.name = QuizName;
  ModelQuestion.fragen = questions;
  await ModelQuestion.save();
  process.exit(0);
})();
