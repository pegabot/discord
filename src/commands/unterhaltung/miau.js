/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */
const { fetchWithTimeout } = require("./../../utils");
const emojiStrip = require("emoji-strip");
const querystring = require("querystring");
const { MessageAttachment } = require("discord.js");

exports.run = async (bot, msg, args) => {
  let text = emojiStrip(msg.cleanContent)
    .replace(/[^a-üA-Ü0-9-_]/g, " ")
    .slice(bot.config.prefix.length + 4)
    .trim()
    .split(" ")
    .filter((elt) => elt !== "");

  if (text.length < 1) text = ["miau"];

  try {
    const result = await fetchWithTimeout(`https://cataas.com/cat/says/${querystring.escape(text.join(" "))}?${new Date().getTime()}&size=50&color=white&type=large`, {}, 4000);
    const buffer = await result.buffer();
    msg.channel.send("", new MessageAttachment(buffer));
  } catch (e) {
    msg.channel.send(`<@${msg.author.id}> es scheint so, als ob ich gerade keine Katzenbilder für dich laden kan 😿`);
  }
};

exports.info = {
  name: "miau",
  usage: ["miau", "miau <text>"],
  help: "Liefert ein zufälliges Katzenbild zurück.",
  channel: ["718145438339039325", "698189934879571999"],
};
