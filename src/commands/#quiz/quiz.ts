/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import prettyMs from "pretty-ms";
import bot from "../../bot";
import { colors } from "../../constants/colors";
import { Command } from "../../core/commands/command";
import { IFrage, QuizModel, SessionModel } from "../../models/quiz";
import { isProduction } from "../../utils/environment";
import { CommandExecption } from "../../utils/execptions";
import { stripIndents } from "../../utils/stripIndents";

const QuizName = "CONspiracy VI";
const AnzahlFragen = 3;
const expiresInterval = 1000 * 60 * 20; // Milliseconds * Seconds * Minutes

export class QuizCommand extends Command {
  name = "quiz";
  usage = "quiz";
  help = "Das Quiz zur CONspiracy VI.";
  everyone = true;
  repeatable = false;
  channel = ["854711633540808734"];
  unlock = 1624024800000; // Freitag, 18. Juni 2021 16:00:00 GMT+02:00
  lock = 1624226400000; // Montag, 21. Juni 2021 00:00:00 GMT+02:00

  async execute(msg: Message): Promise<void> {
    const newSession = new SessionModel();
    newSession.userId = msg.author.id;
    newSession.status = "in progress";

    const quizzes = await QuizModel.find({ name: QuizName });
    if (quizzes.length == 0) {
      newSession.status = "error";
      newSession.save();
      throw new CommandExecption("Es konnten keine Fragen geladen werden... Bitte wende dich an einen Administrator!");
    }

    newSession.quiz = quizzes[0];
    newSession.fragen = newSession.quiz.fragen.sort(() => Math.random() - Math.random()).slice(0, AnzahlFragen);

    // const vouchers = await VoucherModel.find({ used: false });
    // if (vouchers.length == 0) {
    //   newSession.status = "error";
    //   newSession.save();
    //   throw new CommandExecption("Es konnte kein Gutschein erzeugt werden... Bitte wende dich an einen Administrator!");
    // }

    const closedSessions = await SessionModel.find({ userId: newSession.userId, won: true, status: "closed", "quiz.name": QuizName });
    if (closedSessions.length != 0 && msg.channel.id !== bot.config.adminChannel) {
      msg.author.send(
        stripIndents(
          `
        Es sieht so aus, als hättest du bereits erfolgreich an unserem Geek Quiz teilgenommen und alle drei Fragen korrekt beantwortet. Auch wenn wir uns freuen, dass dir unser Geek Quiz so viel Spaß gemacht hat, dass du noch mehr Fragen beantworten möchtest, kann jede Person leider nur 1x teilnehmen. Mach es dir also im Lostopf gemütlich und vertreib dir die Zeit bis zur Auslosung kommende Woche doch mit den anderen Angeboten der CONspiracy.
        
        Bis Sonntag kannst du z.B. an unserem Gewinnspiel teilnehmen, bei dem wir ebenfalls drei Pegasus Spiele Fanpakete verlosen. 
        
        Dein Pegabot :robot:
        `,
        ),
      );
      return;
    }

    const activeSession = await SessionModel.find({ userId: newSession.userId, status: "in progress" });
    if (activeSession.length != 0 && msg.channel.id !== bot.config.adminChannel) {
      throw new CommandExecption("Du spielst schon eine Partie!");
    }

    newSession.expires = Number(Date.now()) + expiresInterval;
    newSession.save();

    const filter = (reaction: MessageReaction, user: User) =>
      (reaction.emoji.name === "🇦" || reaction.emoji.name === "🇧" || reaction.emoji.name === "🇨") && user.id === msg.author.id;

    let winning = true;
    let counter = 0;

    let falscheAntworten: IFrage[] = [];

    try {
      msg.author.send(
        new MessageEmbed()
          .setColor(colors.orange)
          .setTitle(`${QuizName} - das Quiz!`)
          .setDescription(
            stripIndents(`
            Wie viel Geek steckt in dir? Zeig es uns und beantworte folgende Fragen rund um Filme, Serien, Bücher, Rollen-/Brettspiele und weitere absolut relevante Themen des Geek Daseins. 
            
            Zur Beantwortung der Fragen hast du ${prettyMs(
              expiresInterval,
            )} Zeit. Wenn du es innerhalb dieser Zeit schaffst, alle drei Fragen richtig zu beantworten gehst du nicht über Los, sondern landest sofort im Lostopf. In der Woche nach der CONspiracy zieht unsere Glücksfee (m/w/d) dann drei Namen daraus, die jeweils eines der drei ultimatives Pegasus Spiele Fanpaket gewinnen:
            
            Paket 1:
              - Bumuntu 
              - Dive 
              - Doodle Dungeon
            
            Paket 2:
              - Spy Connection 
              - Ghost Adventure
              - Doodle Dungeon
            
            Paket 3:
              - Celtic
              - Junta
              - Adventure Island
            
            Um die Fragen zu beantworten, klicke auf A, B oder C unterhalb der jeweiligen Frage.

            Viel Erfolg! :four_leaf_clover:
          `),
          )
          .setTimestamp()
          .setFooter("SessionId - " + newSession._id),
      );

      for (const [index, frage] of newSession.fragen.entries()) {
        const quizEmbed = new MessageEmbed()
          .setColor(colors.babyblue)
          .addField(`Frage ${index + 1} von ${AnzahlFragen}`, frage.frage)
          .addField("🇦 - " + frage.antworten[0], "-----")
          .addField("🇧 - " + frage.antworten[1], "-----")
          .addField("🇨 - " + frage.antworten[2], "-----")
          .setTimestamp();

        if (!isProduction()) quizEmbed.addField("Richtige Antwort", ["🇦", "🇧", "🇨"][frage.richtig]);

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
                newSession.shipped = true;
                msg.author.send(
                  stripIndents(`
                  Herzlichen Glückwunsch – du hast alle Fragen richtig beantwortet!

                  Wir sind ehrlich beeindruckt und haben dir daher gleich einen Fensterplatz im Lostopf organisiert. Sollte unsere Glücksfee (m/w/d) bei der Gewinnauslosung kommende Woche deinen Namen ziehen, gewinnst du eines der drei Pegasus Spiele Fanpakete. Wir drücken dir die Daumen!
                  
                  Bitte beachte, dass alle Gewinnenden im Anschluss an die Ziehung von uns via Discord Privatnachricht  kontaktiert werden. Solltest du nichts von uns hören, hat es leider nicht geklappt.
                  
                  Wenn du deine Chancen auf ein paar coole neue Spiele maximieren möchtest, dann schau auch gleich bei unserem Gewinnspiel vorbei, bei dem du noch bis Ende der CONspiracy ebenfalls eines von drei Pegasus Spiele Fanpaketen gewinnen kannst!
                  
                  Dein Pegabot :robot:
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
                    Vielen Dank fürs Mitmachen. Leider war jedoch mindestens eine deiner Antworten nicht korrekt. Aber wir sind uns sicher, du weißt noch mehr! Also zeig uns, was in dir steckt und probiere es gleich nochmal, um dir deine Chance auf eines der drei Pegasus Spiele Fanpakete zu sichern.
                    
                    Dir fällt es bei der Hitze schwer, die selten genutzten Geek Areale deines Gehirns zu durchforsten? We feel you! Daher hast du bei unserem Gewinnspiel ebenfalls die Chance auf eines von drei Fanpaketen – ganz ohne Quizfragen. 
                    
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
    } catch (error: any) {
      newSession.status = "error";
      newSession.save();
      if (error.code === 50007)
        throw new CommandExecption("Ich konnte dir keine Nachricht senden, stelle sicher, dass du Direktnachrichten in den Einstellungen aktiviert hast!");
      throw new Error(error);
    }
  }
}
