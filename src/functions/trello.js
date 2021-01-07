/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const Trello = require("../lib/trello/main");
const {
  trello: { getCustomFieldItemsOnBoard, getAttachment },
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
    const { id: cardId, name, url, idAttachmentCover: attechmentId, customFieldItems: fields } = card;

    let attachmentUrl;
    if (attechmentId) {
      const { url } = await getAttachment(trello, cardId, attechmentId);
      attachmentUrl = url;
    }

    // Kategorie, Tischname, Voicechannel
    if (!["5ff48430149da602aaa800a3", "5ff4844e96f0867d8a01f399", "5ff4846133e3a636715007b2"].every((i) => fields.map((elt) => elt.idCustomField).includes(i))) continue;

    const categoryField = fields.find((elt) => elt.idCustomField === "5ff48430149da602aaa800a3");
    const tableField = fields.find((elt) => elt.idCustomField === "5ff4844e96f0867d8a01f399");
    const voiceField = fields.find((elt) => elt.idCustomField === "5ff4846133e3a636715007b2");

    const guild = bot.guilds.cache.get(bot.config.guildId);

    const category = await guild.channels.create(categoryField.value.text, {
      type: "category",
    });

    await guild.channels.create(tableField.value.text, {
      type: "text",
      topic: url,
      parent: category,
      position: 1,
    });
    await guild.channels.create(voiceField.value.text, {
      type: "voice",
      topic: url,
      parent: category,
      position: 2,
    });

    guild.channels.cache.get(bot.config.TRELLO_INFO_CHANNEL).send(url);
    if (attachmentUrl) guild.channels.cache.get(bot.config.TRELLO_INFO_CHANNEL).send(attachmentUrl);

    await trello.updateCustomFieldOnCard(cardId, "5ff4e85340aee5734ae67a76", { checked: "true" });

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
