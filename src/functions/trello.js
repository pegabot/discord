/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const Trello = require("trello");
const {
  trello: { getCustomFieldItemsOnBoard, updateCustomFieldOnCard },
} = require("../utils");
let trello;

exports.setup = async (bot) => {
  trello = new Trello(bot.config.TRELLO_KEY, bot.config.TRELLO_TOKEN);
};

exports.run = async (bot) => {
  const TrelloCardModel = bot.db.model("trelloCard");
  const current_trelloCards = await TrelloCardModel.find({});

  const filter = (card) => {
    return card.customFieldItems.length > 0 && !current_trelloCards.map((elt) => elt.cardId).includes(card.id);
  };

  const boardId = "5e8b2177a8edb534a9bcf315";

  const cards = new Array(await getCustomFieldItemsOnBoard(trello, boardId))[0].filter(filter);
  if (cards.length < 1) return;

  for (const card of cards) {
    const { id: cardId, name, url, customFieldItems: fields } = card;

    // Kategorie, Tischname, Voicechannel
    if (!["5ff48430149da602aaa800a3", "5ff4844e96f0867d8a01f399", "5ff4846133e3a636715007b2"].every((i) => fields.map((elt) => elt.idCustomField).includes(i))) continue;

    const category_field = fields.find((elt) => elt.idCustomField === "5ff48430149da602aaa800a3");
    const tableName_field = fields.find((elt) => elt.idCustomField === "5ff4844e96f0867d8a01f399");
    const voicechannel_field = fields.find((elt) => elt.idCustomField === "5ff4846133e3a636715007b2");

    const category = await bot.guilds.cache.get(bot.config.guildId).channels.create(category_field.value.text, {
      type: "category",
    });

    await bot.guilds.cache.get(bot.config.guildId).channels.create(tableName_field.value.text, {
      type: "text",
      topic: url,
      parent: category,
      position: 1,
    });
    await bot.guilds.cache.get(bot.config.guildId).channels.create(voicechannel_field.value.text, {
      type: "voice",
      topic: url,
      parent: category,
      position: 2,
    });

    // To-Do
    // await updateCustomFieldOnCard(trello, cardId, "");

    const TrelloCard = new TrelloCardModel();
    TrelloCard.cardId = cardId;
    TrelloCard.name = name;
    TrelloCard.url = url;
    TrelloCard.fields = fields;
    await TrelloCard.save();
  }
};

exports.info = {
  name: "Trello",
  env: "trello",
  interval: 30000,
};
