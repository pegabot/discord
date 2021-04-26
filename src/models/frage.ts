/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Schema } from "mongoose";

export interface IFrage {
  frage: string;
  antworten: string[];
  richtig: number;
  eingabe?: number;
}

export const FrageSchema = new Schema({
  frage: String,
  antworten: [String],
  richtig: Number,
  eingabe: Number,
});
