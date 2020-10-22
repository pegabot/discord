/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { stripIndents } = require("../utils");

exports.run = async (bot) => {
  const SessionModel = bot.db.model("session");

  const sessions = await SessionModel.find({ status: "closed", won: true, shipped: false });
  if (sessions.length === 0) return;

  const VoucherModel = bot.db.model("voucher");
  const vouchers = await VoucherModel.find({ used: false });

  if (vouchers.length === 0) return;

  for (const [index, session] of sessions.entries()) {
    const voucher = vouchers[index];

    bot.users.cache.get(session.userId).send(
      stripIndents(`
      Dein Gutscheincode für den Pegasus Shop lautet ***${voucher.code}***. Mit diesem Gutscheincode erhältst du einmalig auf eine Bestellung unter https://pegasusshop.de einen Rabatt von ***10%*** auf alle lieferbaren, nicht preisgebundenen Artikel. Gib den Code dazu vor Absenden deiner Bestellung im Warenkorb ein. Der Code ist bis 25.10.2020 23:59 Uhr gültig.
      
      Du möchtest regelmäßig die neuesten Updates zu unseren Events, Aktionen und Angeboten erhalten? Dann abonniere unseren Newsletter unter https://pegasus.de/newsletter 

      Dein Pegabot :robot:
      `),
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
  interval: 20000,
};
