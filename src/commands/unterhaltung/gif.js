/*
 * Copyright (c) 2020 - 2021 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */
const { fetchWithTimeout } = require("./../../utils");
const emojiStrip = require("emoji-strip");
const querystring = require("querystring");

exports.run = async (bot, msg, args) => {
  let text = emojiStrip(msg.cleanContent)
    .replace(/[^a-üA-Ü0-9-_]/g, " ")
    .slice(bot.config.prefix.length + 4)
    .trim()
    .split(" ")
    .filter((elt) => elt !== "");

  if (text.length < 1) text = ["pegasus"];

  try {
    const result = await fetchWithTimeout(`https://api.tenor.com/v1/search?q=${querystring.escape(text.join(" "))}&key=${bot.config.TENOR_API_KEY}&limit=1&${new Date().getTime()}`);
    const json = await result.json();
    msg.channel.send(json.results[0].itemurl);
  } catch (e) {
    msg.channel.send(`<@${msg.author.id}> es scheint so, als ob ich gerade keine GIFs von Tenor beziehen kann....`);
  }
};

exports.info = {
  name: "gif",
  usage: ["gif", "gif <text>"],
  help: "Suche nach GIFs mit Hilfer der tenor API.",
};
