/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { stripIndents } = require("../utils");

const minutes = 20;

exports.setup = async (bot) => {
  const SessionModel = bot.db.model("session");

  const sessions = await SessionModel.find({ status: "in progress" });
  if (sessions.length === 0) return;

  bot.logger.info(`Setting stale status to ${sessions.length} session(s)!`);
  for (const session of sessions) {
    session.status = "stale";
    session.save();
  }
};

exports.execute = async (bot) => {
  const SessionModel = bot.db.model("session");

  const sessions = await SessionModel.find({ status: "in progress", created: { $lt: Date.now() - minutes * 60000 } });

  if (sessions.length === 0) return;

  for (const session of sessions) {
    try {
      bot.users.cache.get(session.userId).send(
        stripIndents(`
        Du hast dein Spiel leider nicht in der vorgegebenen Zeit zu Ende gespielt und somit die Chance auf den Gewinn verpasst.
        
        Dein Pegabot :robot:
        `),
      );

      session.status = "closed";
      session.timedOut = true;

      session.save();
    } catch (e) {
      continue;
    }
  }
};

exports.info = {
  name: `Reset Sessions: ${minutes} minutes`,
  env: "sessionreset",
  interval: 20000,
};
