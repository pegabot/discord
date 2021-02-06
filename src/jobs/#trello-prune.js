/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const Trello = require("../lib/trello/main");
const {
  trello: { getCustomFieldItemsOnBoard },
} = require("../utils");
let trello;

exports.setup = async (bot) => {
  trello = new Trello(bot.config.TRELLO_KEY, bot.config.TRELLO_TOKEN);
};

exports.execute = async (bot) => {
  const TrelloCardModel = bot.db.model("trelloCard");
  const current_trelloCards = await TrelloCardModel.find({});

  if (current_trelloCards.length < 1) return;

  const boardId = "5e8b2177a8edb534a9bcf315";

  const filter = (card) => card.customFieldItems.filter((elt) => elt.idCustomField !== "5ff4e85340aee5734ae67a76").length > 0;
  const cards = new Array(await getCustomFieldItemsOnBoard(trello, boardId))[0].filter(filter);

  const matches = current_trelloCards.filter((elt) => !cards.map((elt) => elt.id).includes(elt.cardId));

  for (const match of matches) {
    bot.logger.admin(`Trello: lösche Datenbankeintrag für Card: ${match.cardId}`);
    match.remove();
  }
};

exports.info = {
  name: "Trello Prune",
  env: "trello",
  interval: 30000,
};
