/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CategoryChannel, TextChannel } from "discord.js";
import { Task } from "../core/tasks/task";
import { TrelloCardModel } from "../models/trelloCard";
import { isProduction } from "../utils/environment";
import { getAttachment, getCustomFieldItemsOnBoard } from "../utils/trello";

const Trello = require("../../lib/trello/main");

export class TrelloCardTask extends Task {
  name = "Trello Runden in den Rundenaushang schicken";
  env = "trello";
  interval = 30000;

  trello: any;

  setup(): void {
    this.trello = new Trello(this.bot.config.TRELLO_KEY, this.bot.config.TRELLO_TOKEN);
  }

  execute(): void {
    TrelloCardModel.find({}, async (error, current_trelloCards) => {
      if (error) throw error;

      const filter = (card: any) => {
        return card.customFieldItems.length > 0 && !current_trelloCards.map((elt) => elt.cardId).includes(card.id);
      };

      const boardId = "5e8b2177a8edb534a9bcf315";

      const cards = new Array(await getCustomFieldItemsOnBoard(this.trello, boardId))[0].filter(filter);
      if (cards.length < 1) return;

      for (const card of cards) {
        const { id: cardId, name, url, idAttachmentCover: attechmentId, customFieldItems: fields } = card;

        let attachmentUrl;
        if (attechmentId) {
          const { url } = await getAttachment(this.trello, cardId, attechmentId);
          attachmentUrl = url;
        }

        // Kategorie, Tischname, Voicechannel
        if (
          !["5ff48430149da602aaa800a3", "5ff4844e96f0867d8a01f399", "5ff4846133e3a636715007b2"].every((i) =>
            fields.map((elt: any) => elt.idCustomField).includes(i),
          )
        )
          continue;

        const categoryField = fields.find((elt: any) => elt.idCustomField === "5ff48430149da602aaa800a3");
        const tableField = fields.find((elt: any) => elt.idCustomField === "5ff4844e96f0867d8a01f399");
        const voiceField = fields.find((elt: any) => elt.idCustomField === "5ff4846133e3a636715007b2");

        const guild = this.bot.client.guilds.cache.get(this.bot.config.guildId || "");

        if (!guild) continue;

        const everyone_role = guild.roles.cache.find((role) => role.name === "@everyone");
        const conspirative_role = guild.roles.cache.find((role) => role.id === "694076637355966480");
        const de_role = guild.roles.cache.find((role) => role.id === "737260355763306626");

        this.bot.logger.admin(`Trello: erstelle Kanäle für Card: ${cardId}`);

        let category: CategoryChannel;
        if (isProduction()) {
          category = await guild.channels.create(categoryField.value.text, {
            type: "category",
            permissionOverwrites: [
              {
                type: "role",
                id: everyone_role?.id || "",
                deny: [
                  "CREATE_INSTANT_INVITE",
                  "KICK_MEMBERS",
                  "BAN_MEMBERS",
                  "MANAGE_CHANNELS",
                  "MANAGE_GUILD",
                  "ADD_REACTIONS",
                  "VIEW_AUDIT_LOG",
                  "PRIORITY_SPEAKER",
                  "STREAM",
                  "VIEW_CHANNEL",
                  "SEND_MESSAGES",
                  "SEND_TTS_MESSAGES",
                  "MANAGE_MESSAGES",
                  "EMBED_LINKS",
                  "ATTACH_FILES",
                  "READ_MESSAGE_HISTORY",
                  "MENTION_EVERYONE",
                  "USE_EXTERNAL_EMOJIS",
                  "VIEW_GUILD_INSIGHTS",
                  "CONNECT",
                  "SPEAK",
                  "MUTE_MEMBERS",
                  "DEAFEN_MEMBERS",
                  "MOVE_MEMBERS",
                  "USE_VAD",
                  "CHANGE_NICKNAME",
                  "MANAGE_NICKNAMES",
                  "MANAGE_ROLES",
                  "MANAGE_WEBHOOKS",
                  "MANAGE_EMOJIS",
                ],
              },
              {
                type: "role",
                id: de_role?.id || "",
                allow: [
                  "USE_VAD",
                  "STREAM",
                  "CONNECT",
                  "SPEAK",
                  "USE_EXTERNAL_EMOJIS",
                  "CREATE_INSTANT_INVITE",
                  "VIEW_CHANNEL",
                  "SEND_MESSAGES",
                  "SEND_TTS_MESSAGES",
                  "EMBED_LINKS",
                  "ATTACH_FILES",
                  "READ_MESSAGE_HISTORY",
                  "ADD_REACTIONS",
                ],
                deny: [
                  "KICK_MEMBERS",
                  "BAN_MEMBERS",
                  "MANAGE_CHANNELS",
                  "MANAGE_GUILD",
                  "VIEW_AUDIT_LOG",
                  "PRIORITY_SPEAKER",
                  "MANAGE_MESSAGES",
                  "MENTION_EVERYONE",
                  "VIEW_GUILD_INSIGHTS",
                  "MUTE_MEMBERS",
                  "DEAFEN_MEMBERS",
                  "MOVE_MEMBERS",
                  "CHANGE_NICKNAME",
                  "MANAGE_NICKNAMES",
                  "MANAGE_ROLES",
                  "MANAGE_WEBHOOKS",
                  "MANAGE_EMOJIS",
                ],
              },
              {
                type: "role",
                id: conspirative_role?.id || "",
                allow: [
                  "PRIORITY_SPEAKER",
                  "MANAGE_MESSAGES",
                  "MENTION_EVERYONE",
                  "USE_VAD",
                  "STREAM",
                  "CONNECT",
                  "SPEAK",
                  "USE_EXTERNAL_EMOJIS",
                  "CREATE_INSTANT_INVITE",
                  "VIEW_CHANNEL",
                  "SEND_MESSAGES",
                  "SEND_TTS_MESSAGES",
                  "EMBED_LINKS",
                  "ATTACH_FILES",
                  "READ_MESSAGE_HISTORY",
                  "ADD_REACTIONS",
                  "MUTE_MEMBERS",
                  "DEAFEN_MEMBERS",
                ],
                deny: [
                  "KICK_MEMBERS",
                  "BAN_MEMBERS",
                  "MANAGE_CHANNELS",
                  "MANAGE_GUILD",
                  "VIEW_AUDIT_LOG",
                  "VIEW_GUILD_INSIGHTS",
                  "MOVE_MEMBERS",
                  "CHANGE_NICKNAME",
                  "MANAGE_NICKNAMES",
                  "MANAGE_ROLES",
                  "MANAGE_WEBHOOKS",
                  "MANAGE_EMOJIS",
                ],
              },
            ],
          });
        } else {
          category = await guild.channels.create(categoryField.value.text, {
            type: "category",
          });
        }

        guild.channels.create(tableField.value.text, {
          type: "text",
          topic: url,
          parent: category,
          position: 1,
        });

        guild.channels.create(voiceField.value.text, {
          type: "voice",
          topic: url,
          parent: category,
          position: 2,
        });

        const channel = guild?.channels?.cache.get(this.bot.config.TRELLO_INFO_CHANNEL || "");
        if (!channel) continue;

        (channel as TextChannel).send(url);
        if (attachmentUrl) (channel as TextChannel).send(attachmentUrl);
        if (isProduction()) this.trello.addCommentToCard(cardId, "Eine entsprechende Benachrichtigung wurde in den Rundenaushang geschickt.");

        this.trello.updateCustomFieldOnCard(cardId, "5ff4e85340aee5734ae67a76", { checked: "true" });
        if (isProduction()) this.trello.addCommentToCard(cardId, "Die Kanäle wurden erfolgreich angelegt.");

        const TrelloCard = new TrelloCardModel();
        TrelloCard.cardId = cardId;
        TrelloCard.name = name;
        TrelloCard.url = url;
        TrelloCard.fields = fields;
        TrelloCard.save();
      }
    });
  }
}
