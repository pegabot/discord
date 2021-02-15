/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { BotExecption, stripIndents } = require("../../utils");
const { MessageEmbed } = require("discord.js");

const QuizName = "CONspiracy IV";
const AnzahlFragen = 3;

module.exports = {
  name: "nerdquiz",
  usage: "nerdquiz",
  help: "Das Quiz zur CONspiracy IV.",
  unlock: 1606467600000, // Freitag, 27. November 2020 10:00:00 GMT+01:00 https://www.epochconverter.com,
  lock: 1606690799000, // Sonntag, 29. November 2020 23:59:59 GMT+01:00 https://www.epochconverter.com,
  channel: ["780482034522521600"],
  execute: async (bot, msg) => {
    const SessionModel = bot.db.model("session");
    const VoucherModel = bot.db.model("voucher");
    const QuizModel = bot.db.model("quiz");

    const newSession = new SessionModel();
    newSession.userId = msg.author.id;
    newSession.status = "in progress";

    const closedSessions = await SessionModel.find({ userId: newSession.userId, status: "closed", "quiz.name": QuizName });
    if (closedSessions.length != 0 && msg.channel.id !== bot.config.adminChannel) {
      throw new BotExecption("Du hast bereits schon eine Partie gespielt!", msg.author);
    }

    const activeSession = await SessionModel.find({ userId: newSession.userId, status: "in progress" });
    if (activeSession.length != 0 && msg.channel.id !== bot.config.adminChannel) {
      throw new BotExecption("Du spielst schon eine Partie!", msg.author);
    }

    const quizzes = await QuizModel.find({ name: QuizName });
    if (quizzes.length == 0) {
      newSession.status = "error";
      newSession.save();
      throw new BotExecption("Es konnten keine Fragen geladen werden... Bitte wende dich an einen Administrator!", msg.author);
    }

    newSession.quiz = quizzes[0];
    newSession.fragen = newSession.quiz.fragen.sort(() => Math.random() - Math.random()).slice(0, AnzahlFragen);

    const vouchers = await VoucherModel.find({ used: false });
    if (vouchers.length == 0) {
      newSession.status = "error";
      newSession.save();
      throw new BotExecption("Es konnte kein Gutschein erzeugt werden... Bitte wende dich an einen Administrator!", msg.author);
    }

    newSession.save();

    const filter = (reaction, user) =>
      (reaction.emoji.name === "🇦" || reaction.emoji.name === "🇧" || reaction.emoji.name === "🇨") && user.id === msg.author.id;

    let winning = true;
    let counter = 0;

    let falscheAntworten = [];

    try {
      msg.author.send(
        new MessageEmbed()
          .setColor("#FF9033")
          .setTitle(`${QuizName} - das Quiz!`)
          .setDescription(
            stripIndents(`
            Wie viel Geek steckt in dir? Zeig es uns und beantworte uns folgende Fragen rund um Filme, Serien, Bücher, Rollen-/Brettspiele und weitere absolut relevante Themen des Geek-Daseins.

            ***Zur Beantwortung der Fragen hast du 20 Minuten Zeit.*** Wenn du es innerhalb dieser Zeit schaffst, alle Fragen richtig zu beantworten, sind wir schwer beeindruckt und droppen sofort einen Gutscheincode für ein kostenloses digitales Rollenspiel-Bundle, bei dem dein Geek-Herz höher schlagen wird: Talisman Adventures Fantasy RPG Core Rulebook, Shadowrun Roman Alter Ego, Shadowrun Roman Marlene lebt, Shadowrun: Neo-Anarchistische Enzyklopädie, Cthulhu: Bestimmungsbuch der unaussprechlichen Kreaturen.

            Den Code kannst du sofort oder bis spätestens 14.12.2020 auf www.pegasusdigital.de einlösen.

            Um die Fragen zu beantworten, klicke auf A, B oder C unterhalb der jeweiligen Frage.

            Viel Erfolg! :four_leaf_clover:
          `),
          )
          .setTimestamp()
          .setFooter("SessionId - " + newSession._id),
      );

      for (const [index, frage] of newSession.fragen.entries()) {
        const quizEmbed = new MessageEmbed()
          .setColor("#0099ff")
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
          })
          .then(async (collected) => {
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

                Leider war jedoch mindestens eine deiner Antworten nicht korrekt. Aber keine Sorge, wir haben da was für dich vorbereitet: Von 26.-30.11.2020 erhältst du unter www.pegasusdigital.de 20% Rabatt auf Artikel, die innerhalb der letzten zwei Jahre erschienen sind und sogar 40% Rabatt auf Artikel, die schon älter als zwei Jahre sind (Oldies but Goldies!). Neuheiten, die innerhalb der letzten 30 Tage erschienen sind, und Bundles sind von der Rabattaktion ausgeschlossen.

                Außerdem kannst du noch bis 29.11.2020 23:59 Uhr an unserer CONspiracy-Umfrage teilnehmen: https://de.surveymonkey.com/r/QK9YDD6. Unter allen, die uns dort ihre Meinung sagen, verlosen wir drei Überraschungspakete im Wert von mindestens 100€.

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
