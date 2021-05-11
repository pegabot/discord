/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";

export interface IWelcomemessage extends Document {
  messageId: string;
  de_roleId: string;
  en_roleId: string;
}

const WelcomemessageSchema = new Schema({
  messageId: String,
  de_roleId: String,
  en_roleId: String,
});

export const WelcomemessageModel = setModel<IWelcomemessage>(path.basename(__filename).split(".js")[0], WelcomemessageSchema);
