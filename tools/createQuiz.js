/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const { schema: QuizSchema } = require("../src/models/quiz");

(async () => {
  await mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,
    useFindAndModify: false,
  });
  const QuizModel = mongoose.model("quiz", QuizSchema);

  const files = fs.readdirSync(path.join(__dirname, "quiz-sets"));

  files
    .filter((elt) => !elt.match("sample"))
    .forEach(async (filename) => {
      const quiz = require(path.join(__dirname, "quiz-sets", filename));

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
    });
})();
