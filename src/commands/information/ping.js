/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { stripIndents } = require("../../utils");

exports.run = async (bot, msg) => {
  const m = await msg.channel.send("Pong!");
  await m.edit(
    stripIndents(
      `Pong!
        Zeit, die in Anspruch genommen wurde: ${m.createdTimestamp - msg.createdTimestamp}ms :timer:
        Ping: ${Math.floor(bot.ws.ping)}ms :heartbeat:`,
    ),
  );
};

exports.info = {
  name: "ping",
  usage: "ping",
  help: "Reaktionszeit des Bots",
  aliases: ["🏓"],
};
