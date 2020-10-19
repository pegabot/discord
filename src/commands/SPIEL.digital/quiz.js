/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { DmExecption, stripIndents } = require("../../utils");
const { MessageEmbed } = require("discord.js");

const QuizName = "SPIEL.digital";
const AnzahlFragen = 3;

exports.run = async (bot, msg) => {
  const SessionModel = bot.db.model("session");
  const VoucherModel = bot.db.model("voucher");
  const QuizModel = bot.db.model("quiz");

  const newSession = new SessionModel();
  newSession.userId = msg.author.id;
  newSession.status = "in progress";

  const closedSession = await SessionModel.find({ userId: newSession.userId, status: "closed" });
  if (closedSession.length != 0 && msg.channel.id !== bot.config.adminChannel) {
    throw new DmExecption("Du hast bereits schon eine Partie gespielt!", msg.author);
  }

  const activeSession = await SessionModel.find({ userId: newSession.userId, status: "in progress" });
  if (activeSession.length != 0) {
    throw new DmExecption("Du spielst schon eine Partie!", msg.author);
  }

  const quizzes = await QuizModel.find({ name: QuizName });
  if (quizzes.length == 0) {
    newSession.status = "error";
    await newSession.save();
    throw new DmExecption("Es konnten keine Fragen geladen werden... Bitte wende dich an einen Administrator!", msg.author);
  }

  newSession.quiz = quizzes[0];
  newSession.fragen = newSession.quiz.fragen.sort(() => Math.random() - Math.random()).slice(0, AnzahlFragen);

  const vouchers = await VoucherModel.find({ used: false });
  if (vouchers.length == 0) {
    newSession.status = "error";
    await newSession.save();
    throw new DmExecption("Es konnte kein Gutschein erzeugt werden... Bitte wende dich an einen Administrator!", msg.author);
  }

  await newSession.save();

  const filter = (reaction, user) => (reaction.emoji.name === "🇦" || reaction.emoji.name === "🇧" || reaction.emoji.name === "🇨") && user.id === msg.author.id;

  let winning = true;
  let counter = 0;

  let falscheAntworten = [];

  try {
    await bot.users.cache.get(msg.author.id).send(
      new MessageEmbed()
        .setColor("#FF9033")
        .setTitle(`${QuizName} - das Quiz!`)
        .setDescription(
          stripIndents(`
          Beantworte uns folgende Fragen rund um Pegasus Spiele richtig und erhalte sofort einen ***10%*** Gutscheincode für den Pegasus Shop.

          Um die Fragen zu beantworten, klicke auf A, B oder C unterhalb der jeweiligen Frage. Hinweise auf die richtigen Antworten findest du an unserem Messestand unter https://spiel.digital/

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
        // .addField("Richtige Antwort", ["🇦", "🇧", "🇨"][frage.richtig])
        .setTimestamp();

      const runningQuiz = await bot.users.cache.get(msg.author.id).send(quizEmbed);
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
              bot.users.cache.get(newSession.userId).send(
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
                wrongQuestionsText += `Deine Antwort auf die Frage ***'${falscheAntwort.frage}'*** war leider nicht korrekt. Die richtige Antwort lautet: ***„${falscheAntwort.antworten[falscheAntwort.richtig]}“***.\n\n`;
              }

              bot.users.cache.get(newSession.userId).send(
                stripIndents(
                  `
                Vielen Dank fürs Mitmachen! :clap:
                
                Leider waren jedoch eine oder mehrere deiner Antworten nicht korrekt. Auch wenn du dieses Mal kein Glück hattest, sichere dir noch bis 25.10.2020 23:59 Uhr die Chance auf eines von drei Überraschungspaketen im Wert von mindestens ***200€*** indem du an unserer kurzen SPIEL.digital Umfrage teilnimmst: www.surveymonkey.de/r/Y57Z6HH

                Du möchtest regelmäßig die neuesten Updates zu unseren Events, Aktionen und Angeboten erhalten? Dann abonniere unseren Newsletter unter https://pegasus.de/newsletter 

                ${wrongQuestionsText}
                Dein Pegabot :robot:
                `,
                ),
              );
            }
            await newSession.save();
          }
        });
    }
  } catch (error) {
    newSession.status = "error";
    await newSession.save();
    throw new DmExecption("Ein Fehler ist aufgetreten... Bite wende dich an einen Administrator!", msg.author);
  }
};

exports.info = {
  name: "quiz",
  usage: "quiz",
  help: "Das Quiz zur SPIEL.digital.",
  unlock: 1603353600000, // Donnerstag, 22. Oktober 2020 10:00:00 GMT+02:00 https://www.epochconverter.com,
  lock: 1603666740000, // Sonntag, 25. Oktober 2020 23:59:00 GMT+01:00 https://www.epochconverter.com,
  channelId: "767346892467863572",
};
