/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const { schema: QuizSchema } = require("../src/models/quiz");

const filename = "quiz.json";

(async () => {
  if (!fs.existsSync(path.join(__dirname, filename))) throw new Error(`${filename} existiert nicht!`);
  const quizzes = require(path.join(__dirname, filename));

  await mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoIndex: true, useFindAndModify: false });
  const QuizModel = mongoose.model("quiz", QuizSchema);

  for (const quiz of quizzes) {
    const newQuiz = new QuizModel();
    newQuiz.name = quiz.name;
    newQuiz.fragen = quiz.fragen;

    const existingQuiz = await QuizModel.find({ name: newQuiz.name });
    if (existingQuiz.length !== 0) {
      existingQuiz.forEach(async (elt) => {
        console.log(`${elt.name} exists - deleting!`);
        await elt.remove();
      });
    }
    console.log(`Saving ${newQuiz.name}!`);
    await newQuiz.save();
  }

  process.exit(0);
})();
