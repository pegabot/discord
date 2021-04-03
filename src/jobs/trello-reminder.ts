/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { TextChannel } from "discord.js";
import { BotJob } from "../classes/job";
import { getAttachment, getCustomFieldItemsOnBoard } from "../utils/trello";

const Trello = require("../../../lib/trello/main");

export class TrelloReminderJob extends BotJob {
  name = "Trello Reminder in den Rundenaushang schicken";
  env = "trello";
  interval = 30000;

  trello: any;

  setup(): void {
    this.trello = new Trello(this.bot.config.TRELLO_KEY, this.bot.config.TRELLO_TOKEN);
  }

  async execute(): Promise<void> {
    const boardId = "5e8b2177a8edb534a9bcf315";
    const fieldId = "5ff6e699dfef7e701eb5ffa5";
    const filter = (card: any) => {
      return card.customFieldItems.find((elt: any) => elt.idCustomField === fieldId && elt.value.checked === "true");
    };

    const cards = new Array(await getCustomFieldItemsOnBoard(this.trello, boardId))[0].filter(filter);
    if (cards.length < 1) return;

    for (const card of cards) {
      const { id: cardId, url, idAttachmentCover: attechmentId } = card;

      let attachmentUrl;
      if (attechmentId) {
        const { url } = await getAttachment(this.trello, cardId, attechmentId);
        attachmentUrl = url;
      }

      const guild = this.bot.client.guilds.cache.get(this.bot.config.guildId || "");
      if (!guild) continue;

      const channel = guild.channels.cache.get(this.bot.config.TRELLO_INFO_CHANNEL || "");
      if (!channel) continue;

      (channel as TextChannel).send(url);
      if (attachmentUrl) (channel as TextChannel).send(attachmentUrl);

      this.trello.addCommentToCard(cardId, "Eine entsprechende Benachrichtigung wurde in den Rundenaushang geschickt.");
      this.trello.updateCustomFieldOnCard(cardId, fieldId, { checked: "false" });
    }
  }
}
