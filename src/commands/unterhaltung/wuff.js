/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { fetchWithTimeout } = require("./../../utils");
const { MessageAttachment } = require("discord.js");

module.exports = {
  name: "wuff",
  usage: ["wuff"],
  help: "Liefert ein zufälliges Hundebild zurück.",
  channel: ["718145438339039325"],
  execute: async (bot, msg) => {
    try {
      const responseJson = await fetchWithTimeout(`https://dog.ceo/api/breeds/image/random`);
      const json = await responseJson.json();
      const response = await fetchWithTimeout(json.message, {});
      const buffer = await response.buffer();
      msg.channel.send("", new MessageAttachment(buffer));
    } catch (e) {
      msg.channel.send(`<@${msg.author.id}> es scheint so, als ob ich gerade keine Hundebilder für dich laden kann 🐶`);
    }
  },
};
