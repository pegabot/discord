/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

exports.run = async (bot) => {
  const SessionModel = bot.db.model("session");

  const sessions = await SessionModel.find({ status: "closed", won: true, shipped: false });
  if (sessions.length === 0) return;

  const VoucherModel = bot.db.model("voucher");
  const vouchers = await VoucherModel.find({ used: false });

  if (vouchers.length === 0) return;

  for (const session of sessions) {
    const voucher = vouchers[Math.floor(Math.random() * vouchers.length)];

    bot.users.cache.get(session.userId).send(`Hier ist dein Gutscheincode: ${voucher.code}`);

    voucher.used = true;
    session.voucher = voucher;
    session.shipped = true;
    await voucher.save();
    await session.save();
  }
};

exports.info = {
  name: "Versende Vouchers",
  env: "voucher",
  interval: 10000,
};
