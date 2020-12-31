/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
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
