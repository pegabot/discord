/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, TextChannel, User } from "discord.js";
import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";

export interface IMessage extends Document {
  message: Message;
  author: User;
  channel: TextChannel;
  date: Date;
}

const MessageSchema = new Schema({
  message: Object,
  author: Object,
  channel: Object,
  date: { type: Date, default: Date.now },
});

export const MessageModel = setModel<IMessage>(path.basename(__filename).split(".js")[0], MessageSchema);
