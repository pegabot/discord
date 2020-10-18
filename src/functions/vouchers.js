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

    bot.users.cache
      .get(session.userId)
      .send(
        `Dein Gutschein-Code für unseren Webshop https://pegasusshop.de lautet ***${voucher.code}***. Diesen kannst du im Warenkorb einlösen und erhältst dort einen Rabatt von 10% auf lieferbaren und nicht preisgebunden Artikel.\n\nDein Pegabot 🤖`,
      );

    voucher.used = true;
    voucher._session = session._id;
    await voucher.save();

    session.voucher = voucher;
    session.shipped = true;
    await session.save();
  }
};

exports.info = {
  name: "Versende Vouchers",
  env: "voucher",
  interval: 10000,
};
