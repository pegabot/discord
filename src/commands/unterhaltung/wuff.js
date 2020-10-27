/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const fetch = require("node-fetch");
const { MessageAttachment } = require("discord.js");

exports.run = async (bot, msg, args) => {
  const responseJson = await fetch(`https://dog.ceo/api/breeds/image/random`);
  const json = await responseJson.json();
  const response = await fetch(json.message);
  const buffer = await response.buffer();
  msg.channel.send("", new MessageAttachment(buffer));
};

exports.info = {
  name: "wuff",
  usage: ["wuff"],
  help: "Liefert ein zufälliges Hundebild zurück.",
  channel: ["718145438339039325", "698189934879571999"],
};
