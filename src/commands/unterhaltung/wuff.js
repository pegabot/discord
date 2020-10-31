/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { fetchWithTimeout } = require("./../../utils");
const { MessageAttachment } = require("discord.js");

exports.run = async (bot, msg) => {
  try {
    const responseJson = await fetchWithTimeout(`https://dog.ceo/api/breeds/image/random`, {}, 4000);
    const json = await responseJson.json();
    const response = await fetchWithTimeout(json.message, {}, 4000);
    const buffer = await response.buffer();
    msg.channel.send("", new MessageAttachment(buffer));
  } catch (e) {
    msg.channel.send(`<@${msg.author.id}> es scheint so, als ob ich gerade keine Hundebilder für dich laden kan 🐶`);
  }
};

exports.info = {
  name: "wuff",
  usage: ["wuff"],
  help: "Liefert ein zufälliges Hundebild zurück.",
  channel: ["718145438339039325", "698189934879571999"],
};
