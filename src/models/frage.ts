/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
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
