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

exports.execute = async (bot) => {
  const boardId = "5e8b2177a8edb534a9bcf315";
  const fieldId = "5ff6e699dfef7e701eb5ffa5";
  const filter = (card) => {
    return card.customFieldItems.find((elt) => elt.idCustomField === fieldId && elt.value.checked === "true");
  };

  const cards = new Array(await getCustomFieldItemsOnBoard(trello, boardId))[0].filter(filter);
  if (cards.length < 1) return;

  for (const card of cards) {
    const { id: cardId, url, idAttachmentCover: attechmentId } = card;

    let attachmentUrl;
    if (attechmentId) {
      const { url } = await getAttachment(trello, cardId, attechmentId);
      attachmentUrl = url;
    }

    const guild = bot.guilds.cache.get(bot.config.guildId);
    guild.channels.cache.get(bot.config.TRELLO_INFO_CHANNEL).send(url);
    if (attachmentUrl) guild.channels.cache.get(bot.config.TRELLO_INFO_CHANNEL).send(attachmentUrl);

    trello.updateCustomFieldOnCard(cardId, fieldId, { checked: "false" });
  }
};

exports.info = {
  name: "Trello Links",
  env: "trello",
  interval: 30000,
};
