/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const { schema: VoucherSchema } = require("../src/models/voucher");

const filename = "vouchers.json";

(async () => {
  if (!fs.existsSync(path.join(__dirname, filename))) throw new Error(`${filename} existiert nicht!`);
  const vouchers = require(path.join(__dirname, filename));

  await mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoIndex: true, useFindAndModify: false });
  const VoucherModel = mongoose.model("voucher", VoucherSchema);

  // for (let i = 0; i < 200; i++) {
  //   console.log(`${i + 1} of 200`);
  //   const ModelVoucher = new VoucherModel();
  //   ModelVoucher.code = "invalid-" + Math.random().toString(36).substring(7);
  //   await ModelVoucher.save();
  // }

  for (const [index, voucher] of vouchers.entries()) {
    console.log(`${index + 1} of ${vouchers.length}`);
    const ModelVoucher = new VoucherModel();
    ModelVoucher.code = voucher.code;
    await ModelVoucher.save();
  }
  process.exit(0);
})();
