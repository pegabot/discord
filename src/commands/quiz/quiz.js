/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { BotExecption, stripIndents } = require("../../utils");
const { MessageEmbed } = require("discord.js");
const prettyMs = require("pretty-ms");

const QuizName = "CONspiracy V";
const AnzahlFragen = 3;
const expiresInterval = 1000 * 60 * 20; // Milliseconds * Seconds * Minutes

module.exports = {
  name: "quiz",
  usage: "quiz",
  help: "Das Quiz zur CONspiracy IV.",
  unlock: 1616749200000, // Freitag, 26. März 2021 10:00:00 GMT+01:00 https://www.epochconverter.com
  lock: 1616968799000, // Sonntag, 28. März 2021 23:59:59 GMT+02:00 https://www.epochconverter.com,
  channel: ["822130448808411179"],
  execute: async (bot, msg) => {
    const SessionModel = bot.db.model("session");
    const VoucherModel = bot.db.model("voucher");
    const QuizModel = bot.db.model("quiz");

    const newSession = new SessionModel();
    newSession.userId = msg.author.id;
    newSession.status = "in progress";

    const quizzes = await QuizModel.find({ name: QuizName });
    if (quizzes.length == 0) {
      newSession.status = "error";
      newSession.save();
      throw new BotExecption("Es konnten keine Fragen geladen werden... Bitte wende dich an einen Administrator!");
    }

    newSession.quiz = quizzes[0];
    newSession.fragen = newSession.quiz.fragen.sort(() => Math.random() - Math.random()).slice(0, AnzahlFragen);

    const vouchers = await VoucherModel.find({ used: false });
    if (vouchers.length == 0) {
      newSession.status = "error";
      newSession.save();
      throw new BotExecption("Es konnte kein Gutschein erzeugt werden... Bitte wende dich an einen Administrator!");
    }

    const closedSessions = await SessionModel.find({ userId: newSession.userId, won: true, status: "closed", "quiz.name": QuizName });
    if (closedSessions.length != 0 && msg.channel.id !== bot.config.adminChannel) {
      return msg.author.send(
        stripIndents(`
        Es sieht so aus, als hättest du bereits erfolgreich an unserem Geek Quiz teilgenommen und einen 30% Gutscheincode für die Splittermond Einstiegsbox „Aufbruch ins Abenteuer“ erhalten. 
        
        Auch wenn wir uns freuen, dass dir unser Quiz so viel Spaß gemacht hat, dass du noch mehr Fragen beantworten möchtest, kann jede Person leider nur 1x teilnehmen. 
        
        Aber bleib doch trotzdem noch ein bisschen hier. Auf unserem Discord-Server findest du nicht nur während der CONspiracy viele andere Rollen- und Brettspiel-Fans, mit denen du dich austauschen kannst! Während der CONspiracy kannst du über Discord außerdem an vielen geleiteten Brett- und Rollenspielrunden teilnehmen. 
        
        Bis Sonntag kannst du auch noch an unserem Gewinnspiel teilnehmen, bei dem es drei Pegasus Spiele-Fanpakete zu gewinnen gibt. Und natürlich streamen wir zusammen mit unseren Partnern Orkenspalter TV und Gratisrollenspieltag noch bis Sonntag ein abwechslungsreiches Programm.

        Dein Pegabot :robot:
        `),
      );
    }

    const activeSession = await SessionModel.find({ userId: newSession.userId, status: "in progress" });
    if (activeSession.length != 0 && msg.channel.id !== bot.config.adminChannel) {
      throw new BotExecption("Du spielst schon eine Partie!");
    }

    newSession.expires = Number(Date.now()) + expiresInterval;
    newSession.save();

    const filter = (reaction, user) =>
      (reaction.emoji.name === "🇦" || reaction.emoji.name === "🇧" || reaction.emoji.name === "🇨") && user.id === msg.author.id;

    let winning = true;
    let counter = 0;

    let falscheAntworten = [];

    try {
      msg.author.send(
        new MessageEmbed()
          .setColor(bot.colors.orange)
          .setTitle(`${QuizName} - das Quiz!`)
          .setDescription(
            stripIndents(`
            Wie viel Geek steckt in dir? Zeig es uns und beantworte uns folgende Fragen rund um Filme, Serien, Bücher, Rollen-/Brettspiele und weitere absolut relevante Themen des Geek-Daseins.

            ***Zur Beantwortung der Fragen hast du ${prettyMs(
              expiresInterval,
            )} Zeit.*** Wenn du es innerhalb dieser Zeit schaffst, alle Fragen richtig zu beantworten, sind wir schwer beeindruckt und droppen sofort einen Gutscheincode (gültig bis 31.03.2021). Mit diesem erhältst du auf www.pegasusshop.de 30% Rabatt auf die Splittermond Einstiegsbox „Aufbruch ins Abenteuer“.

            Um die Fragen zu beantworten, klicke auf A, B oder C unterhalb der jeweiligen Frage.

            Viel Erfolg! :four_leaf_clover:
          `),
          )
          .setTimestamp()
          .setFooter("SessionId - " + newSession._id),
      );

      for (const [index, frage] of newSession.fragen.entries()) {
        const quizEmbed = new MessageEmbed()
          .setColor(bot.colors.babyblue)
          .addField(`Frage ${index + 1} von ${AnzahlFragen}`, frage.frage)
          .addField("🇦 - " + frage.antworten[0], "-----")
          .addField("🇧 - " + frage.antworten[1], "-----")
          .addField("🇨 - " + frage.antworten[2], "-----")
          .setTimestamp();

        if (process.env.NODE_ENV !== "production") quizEmbed.addField("Richtige Antwort", ["🇦", "🇧", "🇨"][frage.richtig]);

        const runningQuiz = await msg.author.send(quizEmbed);
        runningQuiz.react("🇦");
        runningQuiz.react("🇧");
        runningQuiz.react("🇨");

        runningQuiz
          .awaitReactions(filter, {
            max: 1,
            time: expiresInterval,
          })
          .then(async (collected) => {
            if (collected.array().length === 0) return;

            const array = ["🇦", "🇧", "🇨"];
            const correctAnswer = array[frage.richtig];

            const answerEmoji = collected.array()[0].emoji.name;

            newSession.fragen[index].eingabe = array.findIndex((elt) => elt === answerEmoji);

            if (answerEmoji !== correctAnswer) {
              falscheAntworten.push(frage);
              winning = false;
            }

            counter++;

            if (counter === AnzahlFragen) {
              if (winning) {
                newSession.status = "closed";
                newSession.won = true;
                msg.author.send(
                  stripIndents(`
                Herzlichen Glückwunsch – du hast alle Fragen richtig beantwortet! :tada:
                
                Dein Gutscheincode wird gerade erstellt. Bitte warte einen Moment  - dein Gutscheincode wird dir hier in wenigen Sekunden angezeigt.\n\n
                `),
                );
              } else {
                newSession.status = "closed";
                newSession.falscheAntworten = falscheAntworten;

                let wrongQuestionsText = "";

                for (const falscheAntwort of falscheAntworten) {
                  wrongQuestionsText += `Deine Antwort auf die Frage ***'${
                    falscheAntwort.frage
                  }'*** war leider nicht korrekt. Die richtige Antwort lautet: ***„${falscheAntwort.antworten[falscheAntwort.richtig]}“***.\n\n`;
                }

                msg.author.send(
                  stripIndents(
                    `
                Vielen Dank fürs Mitmachen!

                Leider war jedoch mindestens eine deiner Antworten nicht korrekt. Aber wir sind uns sicher, du weißt noch mehr! Also zeig uns, was in dir steckt und probiere es gleich nochmal, um dir deinen persönlichen 30% Gutscheincode für die Splittermond Einstiegsbox „Aufbruch ins Abenteuer“ zu sichern!

                Also zeig uns, was in dir steckt und probiere es gleich nochmal, um dir deinen persönlichen 30% Gutscheincode für die Splittermond Einstiegsbox „Aufbruch ins Abenteuer“ zu sichern!

                Und schließlich, falls du regelmäßig die neuesten Updates zu unseren Events, Aktionen und Angeboten erhalten möchtest, dann abonniere unseren allgemeinen Pegasus Spiele-Newsletter unter www.pegasus.de/newsletter. In deinem Pegasus Digital-Konto kannst du dich außerdem für unseren Rollenspiel-Newsletter anmelden. Und wer weiß, vielleicht lässt sich dort auch das ein oder andere Wissen für unser nächstes Geek-Quiz sammeln!

                ${wrongQuestionsText}
                Dein Pegabot :robot:
                `,
                  ),
                );
              }
              newSession.save();
            }
          });
      }
    } catch (error) {
      newSession.status = "error";
      newSession.save();
      if (error.code === 50007)
        throw new BotExecption("Ich konnte dir keine Nachricht senden, stelle sicher, dass du Direktnachrichten in den Einstellungen aktiviert hast!");
      throw new Error(error);
    }
  },
};
