/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { BotExecption } = require('../../utils');

exports.run = async (bot, msg, args) => {
  if (args.length < 1) throw new BotExecption('Bitte übergeben die Anzahl der zu löschenden Nachrichten.');
  if (Number.isNaN(args[0])) throw new BotExecption('Deine Anzahl ist keine Zahl.');
  if (args[0] > 50) throw new BotExecption('Ich kann nicht mehr als 50 Nachrichten auf Einmal löschen.');

  const messages = await msg.channel.messages.fetch({ limit: Number(args[0]) + 1 });

  for (const msgToDelete of messages.values()) {
    if (msgToDelete.deletable) {
      msgToDelete.delete();
    } else {
      msg.channel.send(`Ich konnte die folgende Nachricht nicht löschen\n>>> ${msgToDelete.content}`);
    }
  }
};

exports.info = {
  name: 'prune',
  usage: 'prune <Anzahl der zu löschenden Nachrichten>',
  help: 'Löscht eine gewisse Anzahl an Nachrichten',
  permissions: ['KICK_MEMBERS'],
};
