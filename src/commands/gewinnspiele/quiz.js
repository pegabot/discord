/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { BotExecption, DmExecption } = require("../../utils");
const { MessageEmbed } = require("discord.js");

const QuizName = "SPIEL.digital";
const AnzahlFragen = 3;

exports.run = async (bot, msg) => {
  const SessionModel = bot.db.model("session");
  const QuizModel = bot.db.model("quiz");

  const session = new SessionModel();
  session.userId = msg.author.id;

  const closedSession = await SessionModel.find({ userId: session.userId, status: "closed" });
  if (closedSession.length != 0) {
    throw new BotExecption("Du hast bereits schon eine Partie gespielt!");
  }

  const activeSession = await SessionModel.find({ userId: session.userId, status: "in progress" });
  if (activeSession.length != 0) {
    throw new BotExecption("Du spielst schon eine Partie!");
  }

  const VoucherModel = bot.db.model("voucher");
  const vouchers = await VoucherModel.find({ used: false });

  if (vouchers.length == 0) {
    session.status = "error";
    await session.save();
    throw new DmExecption("Es konnte kein Gutschein erzeugt werden... Bitte wende dich an einen Administrator!", msg.author);
  }

  session.status = "in progress";

  await session.save();

  const quizzes = await QuizModel.find({ name: QuizName });
  if (quizzes.length == 0) throw new DmExecption("Ein Fehler ist aufgetreten...", msg.author);

  session.quiz = quizzes[0];
  session.fragen = session.quiz.fragen.sort(() => Math.random() - Math.random()).slice(0, AnzahlFragen);

  const filter = (reaction, user) => (reaction.emoji.name === "🇦" || reaction.emoji.name === "🇧" || reaction.emoji.name === "🇨") && user.id === msg.author.id;

  let winning = true;
  for (const [index, frage] of session.fragen.entries()) {
    const quizEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setAuthor(msg.author.username)
      .setTitle(`${QuizName} - das Quiz!`)
      .addField(`Frage ${index + 1} von ${AnzahlFragen}`, frage.frage)
      .addField("🇦", frage.antworten[0])
      .addField("🇧", frage.antworten[1])
      .addField("🇨", frage.antworten[2])
      .addField(["🇦", "🇧", "🇨"][frage.richtig])
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
        const QuizAwnser = ["🇦", "🇧", "🇨"][frage.richtig];

        if (collected.array()[0].emoji.name !== QuizAwnser) winning = false;

        if (index + 1 === AnzahlFragen) {
          if (winning) {
            session.status = "closed";
            session.won = true;
            bot.users.cache.get(session.userId).send("Du hast alle Fragen richtig beantwortet und gewonnen. Ein Gutscheincode wird dir gleich zugesandt!");
          } else {
            session.status = "closed";
            bot.users.cache.get(session.userId).send(`Du hast leider nicht gewonnen!`);
          }
          await session.save();
        }
      });
  }
};

exports.info = {
  name: "quiz",
  usage: "quiz",
  help: "Das Quiz zur SPIEL.digital.",
  owner: true,
  unlock: 1603335600000, // Donnerstag, 22. Oktober 2020 05:00:00 GMT+02:00 https://www.epochconverter.com
};
