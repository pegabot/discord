/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { BotExecption } from "../../utils/execptions";
import { pollEmbed } from "../../utils/pollEmbed";

export class PollCommand extends Command {
  name = "poll";
  aliases = ["abstimmung"];
  usage = ["poll"];
  help = "Mit diesem Command kannst du eine Abstimmung durchführen.";

  async execute(msg: Message, args: string[]) {
    const questionMessage = await msg.reply("wie lautet deine Frage?");
    questionMessage.channel
      .awaitMessages(() => true, { max: 1, time: 30000, errors: ["time"] })
      .then(async (collected) => {
        const question = collected?.first()?.content;

        if (!question) throw new BotExecption("Du hast leider keine Frage eingegeben!");

        const answerMessage = await msg.reply("wie lauten die Antworten (kommasepariert)?");
        answerMessage.channel
          .awaitMessages(() => true, { max: 1, time: 30000, errors: ["time"] })
          .then(async (collected) => {
            const answers = collected?.first()?.content;

            if (!answers) throw new BotExecption("Du hast leider keine Antworten eingegeben!");

            const timeoutMessage = await msg.reply("wie lange soll die Abstimmung geöffnet bleiben (Sekunden)?");
            timeoutMessage.channel
              .awaitMessages(() => true, { max: 1, time: 30000, errors: ["time"] })
              .then(async (collected) => {
                const timeout = collected?.first()?.content;

                pollEmbed(msg, question, answers.split(","), Number(timeout));
              })
              .catch(() => {
                msg.reply(`:x: du hast leider keine Antwort eingeben! Bitte versuche es erneut mit ${this.bot?.config?.prefix}poll.`);
              });
          })
          .catch(() => {
            msg.reply(`:x: du hast leider keine Antwortmöglichkeiten eingeben! Bitte versuche es erneut mit ${this.bot?.config?.prefix}poll.`);
          });
      })
      .catch(() => {
        msg.reply(`:x: du hast leider keine Frage eingeben! Bitte versuche es erneut mit ${this.bot?.config?.prefix}poll.`);
      });
  }
}
