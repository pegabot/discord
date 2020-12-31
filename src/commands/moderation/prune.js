/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { BotExecption } = require("../../utils");

exports.run = async (bot, msg, args) => {
  if (args[0]) {
    if (Number.isNaN(args[0])) throw new BotExecption("Dein übergebener Wert ist keine Zahl.");
    if (args[0] > 50) throw new BotExecption("Ich kann nicht mehr als 50 Nachrichten auf Einmal löschen.");

    const messages = await msg.channel.messages.fetch({ limit: Number(args[0]) + 1 });

    for (const msgToDelete of messages.values()) {
      if (msgToDelete.deletable) {
        msgToDelete.delete();
      } else {
        msg.channel.send(`Die folgende Nachricht konnte von mir nicht gelöscht werden\n>>> ${msgToDelete.content}`);
      }
    }

    return;
  }

  await msg.channel.bulkDelete(args[0] ? Number(args[0]) + 1 : 100);
};

exports.info = {
  name: "prune",
  usage: "prune <Anzahl der zu löschenden Nachrichten>",
  help: "Löscht eine gewisse Anzahl an Nachrichten",
  permissions: ["KICK_MEMBERS"],
};
