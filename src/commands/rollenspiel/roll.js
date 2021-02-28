/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const {
  RollButler: { generateParams, roll, generateEmbed },
} = require("../../utils");

module.exports = {
  name: "roll",
  aliases: ["r"],
  usage: ["roll (https://pegabot.pegasus.de/dice-rules)"],
  help: "powered by RollButtler",
  execute: async (bot, msg, args) => {
    if (args.length < 1) return msg.reply("es gibt keine Würfel zu würfeln. Bitte überprüfe deine Eingabe.");
    if (args.join(" ").match(/([\dßo]{4,}[dw]|[\dßo]{2,}[dw][\dßo]{6,}|^\/teste?)/i))
      return msg.reply(`dieser Wurf ist nicht valide. Nutze \`${bot.config.prefix}help roll\` für mehr Hilfe.`);

    const dice = args.join(" ");

    const params = generateParams(bot, msg.author, dice);

    const response = await roll(bot, params);

    const embed = generateEmbed(bot, dice, msg.author, response);
    const replied = await msg.reply(embed);
    replied.react("🎲");

    const RollsModel = bot.db.model("rolls");
    const entry = new RollsModel();
    entry.messageId = replied.id;
    entry.dice = dice;
    entry.save();
  },
};
