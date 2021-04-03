/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { MessageReaction, User } from "discord.js";
import { BotEvent } from "../classes/event";
import { RollsModel } from "../models/rolls";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { generateEmbed, generateParams, rollDice } from "../utils/RollButler";

const { MessageAttachment } = require("discord.js");

export class messageReactionAddEvent extends BotEvent {
  async execute(reaction: MessageReaction, user: User): Promise<void> {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        return;
      }
    }

    if (user.bot) return;

    if (
      !Object.entries(this.bot.reactions || [])
        .map((elt) => elt[1])
        .includes(reaction.emoji.name)
    )
      return;

    const {
      message: { id: messageId },
    } = reaction;

    RollsModel.find({ messageId: messageId }, async (error, data) => {
      if (data.length < 1) return;

      const { dice } = data[0];

      const params = generateParams(this.bot, user, dice);

      let response: any = await rollDice(this.bot, params);

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
        const embed = generateEmbed(this.bot, dice, user, response);
        replied = await reaction.message.channel.send(embed);
      }

      replied.react(this.bot.reactions?.rollReaction || "");

      const entry = new RollsModel();
      entry.messageId = replied.id;
      entry.dice = dice;
      entry.save();
    });
  }
}
