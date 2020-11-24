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

    try {
      bot.users.cache.get(session.userId).send(
        stripIndents(`
      Dein Gutscheincode lautet ***${voucher.code}***. Diesen kannst du ab sofort und bis spätestens 14.12.2020 23:59 Uhr auf www.pegasusdigital.de einlösen, um deinen Loot alias dein kostenloses digitales Rollenspiel-Bundle zu erhalten. (Talisman Adventures Fantasy RPG Core Rulebook, Shadowrun Roman Alter Ego, Shadowrun Roman Marlene lebt, Shadowrun: Neo-Anarchistische Enzyklopädie, Cthulhu: Bestimmungsbuch der unaussprechlichen Kreaturen)

      Ebenfalls auf www.pegasusdigital.de erhältst du von 27.-29.11.2020 außerdem 20% Rabatt auf Artikel, die innerhalb der letzten zwei Jahre erschienen sind und sogar 40% Rabatt auf Artikel, die schon älter als zwei Jahre sind (Oldies but Goldies!). Bundles und Neuheiten, die innerhalb der letzten 30 Tage erschienen sind, sind von der Rabattaktion ausgeschlossen.

      Außerdem kannst du noch bis 29.11.2020 23:59 Uhr an unserer CONspiracy-Umfrage teilnehmen: https://de.surveymonkey.com/r/QK9YDD6 Unter allen, die uns dort ihre Meinung sagen, verlosen wir drei Überraschungspakete im Wert von mindestens 100€.

      Und schließlich, falls du regelmäßig die neuesten Updates zu unseren Events, Aktionen und Angeboten erhalten möchtest, dann abonniere unseren allgemeinen Newsletter unter www.pegasus.de/newsletter. In deinem Pegasus Digital-Konto kannst du dich außerdem für unseren Rollenspiel-Newsletter anmelden. Und wer weiß, vielleicht lässt sich dort auch das ein oder andere Wissen für unser nächstes Geek-Quiz sammeln!

      Dein Pegabot :robot:
      `),
      );

      voucher.used = true;
      voucher._session = session._id;
      await voucher.save();

      session.voucher = voucher;
      session.shipped = true;
      await session.save();
    } catch (e) {
      continue;
    }
  }
};

exports.info = {
  name: "Versende Vouchers",
  env: "voucher",
  interval: 20000,
};
