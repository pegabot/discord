/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");
const { schema: VoucherSchema } = require("../src/models/voucher");
const { schema: SessionSchema } = require("../src/models/session");

(async () => {
  await mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoIndex: true, useFindAndModify: false });
  const VoucherModel = mongoose.model("voucher", VoucherSchema);
  const SessionModel = mongoose.model("session", SessionSchema);

  const usedVouchers = await VoucherModel.find({ used: true });
  const sessions = await SessionModel.find({ status: "closed", won: true });

  const sessionVouchers = sessions.map((elt) => elt.voucher.code);

  for (const voucher of usedVouchers) {
    if (!sessionVouchers.includes(voucher.code)) {
      console.log(`Deleting voucher ${voucher.code}`);
      await voucher.remove();
    }
  }
  process.exit(0);
})();
