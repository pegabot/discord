/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.run = async (bot, msg) => {
  await msg.channel.send(`Starte neu 🍹`);
  process.exit(0);
};

exports.info = {
  name: "restart",
  usage: "restart",
  help: "Neustart des Bots",
  owner: true,
  disabled: true,
};
