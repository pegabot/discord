/*
 * Copyright (c) 2020 - 2021 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { BotExecption, resolveUser } = require("../../utils");

exports.run = async (bot, msg, args) => {
  if (args.length < 1) throw new BotExecption("Du musst eine SessionId oder einen Benutzer mit übergeben!");

  const SessionModel = bot.db.model("session");

  let sessions;

  if (msg.mentions.users.size > 0) {
    const user = resolveUser(msg, args.join(" "));

    if (!user) throw new BotExecption("Benutzer nicht gefunden.");

    sessions = await SessionModel.find({ userId: user.id });
    if (sessions.length < 1) throw new BotExecption(`Es wurde keine Session für den User <@${user.id}> gefunden.`);

    for (const session of sessions) {
      msg.channel.send(`Lösche Session ${session._id}`);
      session.remove();
    }
  } else {
    const sessionId = args[0];

    if (!bot.db.Types.ObjectId.isValid(sessionId)) throw new BotExecption("Die übergebene SessionId ist nicht korrekt.");

    sessions = await SessionModel.find({ _id: sessionId });
    if (sessions.length < 1) throw new BotExecption(`Die Session mit der Id ${sessionId} existiert nicht.`);

    const session = sessions[0];
    msg.channel.send(`Lösche Session ${session._id}`);
    session.remove();
  }
};

exports.info = {
  name: "sessionreset",
  usage: "sessionreset <SessionId/ User>",
  help: "Löschen von Sessions.",
  admin: true,
};
