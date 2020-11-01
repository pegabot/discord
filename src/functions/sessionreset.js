/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { stripIndents } = require("../utils");

const minutes = 20;

exports.run = async (bot) => {
  const SessionModel = bot.db.model("session");

  const sessions = await SessionModel.find({ status: "in progress", created: { $lt: Date.now() - minutes * 60000 } });

  if (sessions.length === 0) return;

  for (const session of sessions) {
    try {
      bot.users.cache.get(session.userId).send(
        stripIndents(`
        Du hast dein Spiel leider nicht in der vorgegebenen Zeit zu Ende gespielt, daher schließe ich die Spielrunde für dich. Solltest du noch Einmal spielen wollen, so öffne bitte erneuet eine Runde mit dem entsprechenden Command!
        
        Dein Pegabot :robot:
        `),
      );
      await session.remove();
    } catch (e) {
      continue;
    }
  }
};

exports.info = {
  name: "Setze sessions nach X Minuten zurück",
  env: "sessionreset",
  interval: 20000,
};
