/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { model as setModel, Schema } from "mongoose";
import { FrageSchema } from "./frage";
import * as path from "path";

export const QuizSchema = new Schema({
  name: String,
  fragen: [FrageSchema],
});

export const QuizModel = setModel(path.basename(__filename).split(".js")[0], QuizSchema);
