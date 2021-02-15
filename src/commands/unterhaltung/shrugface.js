/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

module.exports = {
  name: "shrugface",
  aliases: ["shrug"],
  usage: ["shrugface"],
  help: "Es gibt nur ein Shrugface.",
  execute: async (bot, msg, args) => {
    msg.delete();
    msg.channel.send("¯\\_(ツ)_/¯");
  },
};
