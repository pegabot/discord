/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { stripIndents } = require("../utils");

exports.execute = async (bot) => {
  const SessionModel = bot.db.model("session");
  SessionModel.find({ status: "closed", won: true, shipped: false }, (error, sessions) => {
    if (sessions.length === 0) return;

    const VoucherModel = bot.db.model("voucher");
    VoucherModel.find({ used: false }, (error, vouchers) => {
      if (vouchers.length === 0) return;

      for (const [index, session] of sessions.entries()) {
        const voucher = vouchers[index];

        try {
          bot.users.cache.get(session.userId).send(
            stripIndents(`
            Dein Gutscheincode lautet ***${voucher.code}***. Dieser Code ist nicht valide und dient nur zu Testzwecken.

            Dein Pegabot :robot:
            `),
          );

          voucher.used = true;
          voucher._session = session._id;
          voucher.save();

          session.voucher = voucher;
          session.shipped = true;
          session.save();
        } catch (e) {
          continue;
        }
      }
    });
  });
};

exports.info = {
  name: "Vouchers",
  env: "voucher",
  interval: 20000,
};
