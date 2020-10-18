/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { BotExecption } = require("../../utils");

exports.run = async (bot, msg, args) => {
  if (args.length < 1) throw new BotExecption("Bitte übergeben die Anzahl der zu löschenden Nachrichten.");
  if (Number.isNaN(args[0])) throw new BotExecption("Deine Anzahl ist keine Zahl.");
  if (args[0] > 99) throw new BotExecption("Ich kann nicht mehr als 88 Nachrichten auf Einmal löschen.");

  await msg.channel.bulkDelete(Number(args[0]) + 1);
};

exports.info = {
  name: "prune",
  usage: "prune <Anzahl der zu löschenden Nachrichten>",
  help: "Löscht eine gewisse Anzahl an Nachrichten",
  permissions: ["KICK_MEMBERS"],
};
