/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

module.exports = {
  name: "extinguish",
  usage: ["extinguish"],
  help: "Lösche die Känale zur zugehörigen Kategorie und die Kategorie.",
  permissions: ["MANAGE_CHANNELS"],
  execute: async (bot, msg, args) => {
    const {
      channel: { id: channelID, parentID },
    } = msg;

    if (
      Object.keys(bot.config)
        .filter((elt) => elt.toLowerCase().match(/.*channel.*/))
        .map((elt) => bot.config[elt])
        .filter((elt) => elt !== "" && !isNaN(elt))
        .includes(channelID)
    )
      return;

    if (!parentID) {
      return msg.channel.delete();
    } else {
      const category = msg.guild.channels.cache.find((elt) => elt.id === parentID);
      const { children } = category;
      for (const child of children) {
        child[1].delete();
      }
      category.delete();
    }
  },
};
