/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageAttachment } from "discord.js";
import bot from "../bot";
import { Event } from "../classes/event";
import { emojis } from "../constants/emojis";
import { RollsModel } from "../models/rolls";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { generateEmbed, generateParams, rollDice } from "../utils/RollButler";

export default new Event("handleReroll", async (reaction, user) => {
  const {
    message: { id: messageID },
  } = reaction;

  RollsModel.find({ messageId: messageID }, async (error, data) => {
    if (data.length < 1) return;

    const { dice } = data[0];

    const params = generateParams(bot, user, dice);

    let response: any = await rollDice(bot, params);

    try {
      response = JSON.parse(response);
    } catch {
      return;
    }

    let replied;
    if (response?.image) {
      const result: any = await fetchWithTimeout(`https:${response.image}?${new Date().getTime()}`);
      const buffer = await result.buffer();
      replied = await reaction.message.channel.send(response.message, new MessageAttachment(buffer));
    } else {
      const embed = generateEmbed(bot, dice, user, response);
      replied = await reaction.message.channel.send(embed);
    }

    replied.react(emojis.rollEmoji);

    const entry = new RollsModel();
    entry.messageId = replied.id;
    entry.dice = dice;
    entry.save();
  });
});
