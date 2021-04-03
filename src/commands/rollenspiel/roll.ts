/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message, MessageAttachment } from "discord.js";
import { BotCommand } from "../../classes/command";
import { RollsModel } from "../../models/rolls";
import { BotExecption } from "../../utils/BotExecption";
import { fetchWithTimeout } from "../../utils/fetchWithTimeout";
import { generateEmbed, generateParams, rollDice } from "../../utils/RollButler";

export class RollCommand extends BotCommand {
  name = "roll";
  usage = "roll (https://pegabot.pegasus.de/dice-rules)";
  help = "powered by RollButler";
  aliases = ["r"];

  async execute(msg: Message, args: string[]): Promise<void> {
    if (!this.bot) return;

    if (args.length < 1) {
      msg.reply("es gibt keine Würfel zu würfeln. Bitte überprüfe deine Eingabe.");
      return;
    }
    if (args.join(" ").match(/([\dßo]{4,}[dw]|[\dßo]{2,}[dw][\dßo]{6,}|^\/teste?)/i)) {
      msg.reply(`dieser Wurf ist nicht valide. Nutze \`${this.bot.config.prefix}help roll\` für mehr Hilfe.`);
      return;
    }
    const dice = args.join(" ").replace(" ", "");

    const params = generateParams(this.bot, msg.author, dice);

    let response: any = await rollDice(this.bot, params);

    try {
      response = JSON.parse(response);
    } catch {
      throw new BotExecption("Ein Fehler ist aufgetreten!");
    }

    let replied;
    if (response?.image) {
      const result: any = await fetchWithTimeout(`https:${response.image}?${new Date().getTime()}`);
      const buffer = await result.buffer();
      replied = await msg.reply(response.message, new MessageAttachment(buffer));
    } else {
      const embed = generateEmbed(this.bot, dice, msg.author, response);
      replied = await msg.reply(embed);
    }

    if (response.message.match(/.*fehlgeschlagen.*/)) return;

    replied.react(this.bot.reactions?.rollReaction || "");

    const entry = new RollsModel();
    entry.messageId = replied.id;
    entry.dice = dice;
    entry.save();
  }
}
