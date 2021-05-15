/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Event } from "../core/events/event";
import { MessageModel } from "../models/message";
import { ReplaceBlogLinksModel } from "../models/replaceBlogLinks";
import { RollsModel } from "../models/rolls";
import { WelcomemessageModel } from "../models/welcomemessage";

export default new Event("removeMessageFromDatabase", (messageId: string) => {
  MessageModel.find({ "message.id": messageId }, (error, docs) => {
    if (error) throw error;

    docs.forEach((doc) => doc.remove());
  });

  ReplaceBlogLinksModel.find({ messageID: messageId }, (error, docs) => {
    if (error) throw error;

    docs.forEach((doc) => doc.remove());
  });

  RollsModel.find({ messageId: messageId }, (error, docs) => {
    if (error) throw error;

    docs.forEach((doc) => doc.remove());
  });

  WelcomemessageModel.find({ messageId: messageId }, (error, docs) => {
    if (error) throw error;

    docs.forEach((doc) => doc.remove());
  });
});
