/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

require("dotenv").config();

const mongoose = require("mongoose");
const { schema: VoucherSchema } = require("../src/models/voucher");
const { schema: SessionSchema } = require("../src/models/session");

(async () => {
  await mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,
    useFindAndModify: false,
  });
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
