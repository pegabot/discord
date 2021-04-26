/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

require("dotenv").config();

const mongoose = require("mongoose");

const { schema: SessionSchema } = require("../src/models/session");
const { schema: QuizSchema } = require("../src/models/quiz");
const { schema: VoucherSchema } = require("../src/models/voucher");

(async () => {
  await mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,
    useFindAndModify: false,
  });

  const SessionModel = mongoose.model("session", SessionSchema);
  const QuizModel = mongoose.model("quiz", QuizSchema);
  const VoucherModel = mongoose.model("voucher", VoucherSchema);

  const existingSessions = await SessionModel.find({});
  if (existingSessions.length !== 0) {
    existingSessions.forEach(async (elt) => {
      console.log(`Deleting Session with id ${elt._id}!`);
      await elt.remove();
    });
  }

  const existingQuizzes = await QuizModel.find({});
  if (existingQuizzes.length !== 0) {
    existingQuizzes.forEach(async (elt) => {
      console.log(`Deleting Quiz with id ${elt._id}!`);
      await elt.remove();
    });
  }

  const existingVouchers = await VoucherModel.find({});
  if (existingVouchers.length !== 0) {
    existingVouchers.forEach(async (elt) => {
      console.log(`Deleting Voucher with id ${elt._id}!`);
      await elt.remove();
    });
  }
})();
