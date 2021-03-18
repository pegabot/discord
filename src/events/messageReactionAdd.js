/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const {
  RollButler: { generateParams, roll, generateEmbed },
  fetchWithTimeout,
} = require("../utils");
const { MessageAttachment } = require("discord.js");

exports.execute = async (bot, reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      return;
    }
  }

  if (user.bot) return;
  if (reaction._emoji.name !== "🎲") return;

  const {
    message: { id: messageId },
  } = reaction;

  const RollsModel = bot.db.model("rolls");
  RollsModel.find({ messageId: messageId }, async (error, data) => {
    if (data.length < 1) return;

    const { dice } = data[0];

    const params = generateParams(bot, user, dice);

    let response = await roll(bot, params);

    try {
      response = JSON.parse(response);
    } catch {
      return;
    }

    let replied;
    if (response?.image) {
      const result = await fetchWithTimeout(`https:${response.image}?${new Date().getTime()}`);
      const buffer = await result.buffer();
      replied = await reaction.message.channel.send(response.message, new MessageAttachment(buffer));
    } else {
      embed = generateEmbed(bot, dice, user, response);
      replied = await reaction.message.channel.send(embed);
    }

    replied.react("🎲");

    const entry = new RollsModel();
    entry.messageId = replied.id;
    entry.dice = dice;
    entry.save();
  });
};
