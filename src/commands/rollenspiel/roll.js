/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const {
  RollButler: { generateParams, roll, generateEmbed },
  BotExecption,
  fetchWithTimeout,
} = require("../../utils");
const { MessageAttachment } = require("discord.js");

module.exports = {
  name: "roll",
  aliases: ["r"],
  usage: ["roll (https://pegabot.pegasus.de/dice-rules)"],
  help: "powered by RollButler",
  execute: async (bot, msg, args) => {
    if (args.length < 1) return msg.reply("es gibt keine Würfel zu würfeln. Bitte überprüfe deine Eingabe.");
    if (args.join(" ").match(/([\dßo]{4,}[dw]|[\dßo]{2,}[dw][\dßo]{6,}|^\/teste?)/i))
      return msg.reply(`dieser Wurf ist nicht valide. Nutze \`${bot.config.prefix}help roll\` für mehr Hilfe.`);

    const dice = args.join(" ");

    const params = generateParams(bot, msg.author, dice);

    let response = await roll(bot, params);

    try {
      response = JSON.parse(response);
    } catch {
      throw new BotExecption("Ein Fehler ist aufgetreten!");
    }

    let replied;
    if (response?.image) {
      const result = await fetchWithTimeout(`https:${response.image}?${new Date().getTime()}`);
      const buffer = await result.buffer();
      replied = await msg.reply(response.message, new MessageAttachment(buffer));
    } else {
      embed = generateEmbed(bot, dice, msg.author, response);
      replied = await msg.reply(embed);
    }

    if (response.message.match(/.*fehlgeschlagen.*/)) return;

    replied.react("🎲");

    const RollsModel = bot.db.model("rolls");
    const entry = new RollsModel();
    entry.messageId = replied.id;
    entry.dice = dice;
    entry.save();
  },
};
