/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

exports.run = async (bot, msg, args) => {
  if (args[0] > 99) throw new BotExecption("Ich kann nicht mehr als 99 Nachrichten auf Einmal löschen.");

  await msg.channel.bulkDelete(args[0] ? Number(args[0]) + 1 : 100);
};

exports.info = {
  name: "prune",
  usage: "prune <Anzahl der zu löschenden Nachrichten>",
  help: "Löscht eine gewisse Anzahl an Nachrichten",
  permissions: ["KICK_MEMBERS"],
};
