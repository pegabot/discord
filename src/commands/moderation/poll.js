/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { pollEmbed } = require("../../utils");

module.exports = {
  name: "poll",
  aliases: ["abstimmung"],
  usage: ["poll"],
  help: "Mit diesem Command kannst du eine Abstimmung durchführen.",
  execute: async (bot, msg, args) => {
    const questionMessage = await msg.reply("wie lautet deine Frage?");
    questionMessage.channel
      .awaitMessages(() => true, { max: 1, time: 30000, errors: ["time"] })
      .then(async (collected) => {
        const question = collected.first().content;

        const answerMessage = await msg.reply("wie lauten die Antworten (kommasepariert)?");
        answerMessage.channel
          .awaitMessages(() => true, { max: 1, time: 30000, errors: ["time"] })
          .then(async (collected) => {
            const answers = collected.first().content;

            const timeoutMessage = await msg.reply("wie lange soll die Abstimmunge geöffnet bleiben (Sekunden)?");
            timeoutMessage.channel
              .awaitMessages(() => true, { max: 1, time: 30000, errors: ["time"] })
              .then(async (collected) => {
                const timeout = collected.first().content;
                pollEmbed(msg, question, answers.split(","), timeout);
              })
              .catch(() => {
                msg.reply(`:x: du hast leider keine Antwort eingeben! Bitte versuche es erneut mit ${bot.config.prefix}poll.`);
              });
          })
          .catch(() => {
            msg.reply(`:x: du hast leider keine Antwortmöglichkeiten eingeben! Bitte versuche es erneut mit ${bot.config.prefix}poll.`);
          });
      })
      .catch(() => {
        msg.reply(`:x: du hast leider keine Frage eingeben! Bitte versuche es erneut mit ${bot.config.prefix}poll.`);
      });
  },
};
