/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const {
  RollButler: { generateParams, roll, generateEmbed },
} = require("../utils");

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

    const response = await roll(bot, params);

    const embed = generateEmbed(bot, dice, user, response);
    const replied = await reaction.message.channel.send(embed);
    replied.react("🎲");

    const entry = new RollsModel();
    entry.messageId = replied.id;
    entry.dice = dice;
    entry.save();
  });
};
