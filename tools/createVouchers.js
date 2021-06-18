/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const { VoucherSchema } = require("../build/models/quiz");

const filename = "vouchers.json";

(async () => {
  if (!fs.existsSync(path.join(__dirname, filename))) throw new Error(`${filename} existiert nicht!`);
  const vouchers = require(path.join(__dirname, filename));

  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,
    useFindAndModify: false,
  });
  const VoucherModel = mongoose.model("voucher", VoucherSchema);

  const existingVouchers = await VoucherModel.find({});
  const existingCodes = existingVouchers.map((elt) => elt.code);

  for (const [index, voucher] of vouchers.entries()) {
    console.log(`${index + 1} of ${vouchers.length}`);
    const newVoucher = new VoucherModel();
    newVoucher.code = voucher.code;

    if (existingCodes.includes(newVoucher.code)) {
      console.log("Voucher exists - continuing!");
      continue;
    }

    await newVoucher.save();
  }
  process.exit(0);
})();
