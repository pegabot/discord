/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { BotExecption } = require("../../utils");

const validDice = [4, 6, 8, 10, 12, 20, 100];

module.exports = {
  name: "roll",
  aliases: ["r"],
  usage: ["roll d4 | roll 2d4 | roll 2d4 d4"],
  help: "Würfelcommand nach DnD Schreibweise",
  execute: async (bot, msg, args) => {
    let reply = "";
    for (const arg of args) {
      const diceobj = parseNotation(arg);
      if (diceobj.failed) {
        throw new BotExecption("Die Eingabe scheint fehlerhaft zu sein, bitte überprüfe diese und versuche es erneut.");
      }
      for (let [dicevalue, count] of Object.entries(diceobj.counts)) {
        if (count < 1) {
          continue;
        }
        let rolledValues = [];
        for (let i = 0; i < count; i++) {
          rolledValues.push(Math.ceil(Math.random() * dicevalue));
        }
        let valuesString = "";
        for (const value of rolledValues) {
          valuesString += "  `" + value + "`";
        }
        if (count == 1) {
          count = "";
        }
        reply += count + "d" + dicevalue + ":" + valuesString + "\n";
      }
    }
    if (reply == "") {
      msg.reply("Es gibt keine Würfel zu würfeln. Bitte überprüfe deine Eingabe.");
      return;
    }
    msg.reply("\n" + reply);
    return;
  },
};

const parseNotation = (notation) => {
  let diceobj = {
    failed: false,
    errorcode: 0,
    counts: {
      100: 0,
      20: 0,
      12: 0,
      10: 0,
      8: 0,
      6: 0,
      4: 0,
    },
  };

  let notationSplit = notation.split(/[Dd]/);
  let numberOfDice = 1;

  if (notationSplit[0] != "") {
    if (isNaN(notationSplit[0]) || notationSplit[0] < 0) {
      diceobj.failed = true;
      diceobj.errorcode = 1;
      return diceobj;
    }
    numberOfDice = parseInt(notationSplit[0]);
  }

  if (isNaN(notationSplit[1])) {
    diceobj.failed = true;
    diceobj.errorcode = 2;
    return diceobj;
  }

  if (validDice.includes(parseInt(notationSplit[1])) && notationSplit[1] != "") {
    diceobj.counts[notationSplit[1]] += numberOfDice;
  } else {
    diceobj.failed = true;
    diceobj.errorcode = 3;
    return diceobj;
  }

  return diceobj;
};
