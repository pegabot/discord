/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();

const mongoose = require("mongoose");
const { schema: VoucherSchema } = require("../src/models/voucher");

(async () => {
  await mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoIndex: true, useFindAndModify: false });
  const VoucherModel = mongoose.model("voucher", VoucherSchema);

  const unusedVouchers = await VoucherModel.find({ used: false });

  for (const voucher of unusedVouchers) {
    console.log(`Deleting voucher ${voucher.code}`);
    await voucher.remove();
  }
  process.exit(0);
})();