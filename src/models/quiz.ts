/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Document, model as setModel, Schema } from "mongoose";
import * as path from "path";
import { FrageSchema, IFrage } from "./frage";

export interface IQuiz extends Document {
  name: string;
  fragen: IFrage[];
}

export const QuizSchema = new Schema({
  name: String,
  fragen: [FrageSchema],
});

export const QuizModel = setModel<IQuiz>(path.basename(__filename).split(".js")[0], QuizSchema);
