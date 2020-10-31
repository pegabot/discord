/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { fetchWithTimeout } = require("./../../utils");
const { MessageAttachment } = require("discord.js");

exports.run = async (bot, msg) => {
  try {
    const responseJson = await fetchWithTimeout(`http://shibe.online/api/birds`, {}, 4000);
    const json = await responseJson.json();
    const response = await fetchWithTimeout(json[0], {}, 4000);
    const buffer = await response.buffer();
    msg.channel.send("", new MessageAttachment(buffer));
  } catch (e) {
    msg.channel.send(`<@${msg.author.id}> es scheint so, als ob ich gerade keine Vogelbilder für dich laden kan 🦜`);
  }
};

exports.info = {
  name: "piep",
  usage: ["piep"],
  help: "Liefert ein zufälliges Vogelbild zurück.",
  channel: ["718145438339039325", "698189934879571999"],
};
