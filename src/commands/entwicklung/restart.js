/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

exports.run = (bot, msg) => {
  msg.channel.send(`Starte neu 🔜`);
  process.exit(0);
};

exports.info = {
  name: "restart",
  usage: "restart",
  help: "Neustart des Bots",
  owner: true,
};
