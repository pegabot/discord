/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Collection } from "discord.js";
import * as fs from "fs";
import { connect, Schema } from "mongoose";
import * as path from "path";

export class MongoConnector {
  connection: typeof import("mongoose") | undefined;
  models: Collection<string, Schema>;

  constructor() {
    this.connection = undefined;
    this.models = new Collection();
    this.loadModels();
  }

  get names() {
    return [...this.models.keys()];
  }

  get size() {
    return this.models.size;
  }

  get(model: string): Schema | undefined {
    return this.models.get(model);
  }

  has(model: string): boolean {
    return this.models.has(model);
  }

  delete(model: string): boolean {
    return this.models.delete(model);
  }

  async loadModels(): Promise<void> {
    const models = fs.readdirSync(path.join(__dirname, "..", "models"));
    for (const model of models) {
      const name = model.split(".")[0];
      if (/\w?#.+/.test(name)) continue;

      const module = await require(path.join(__dirname, "..", "models", name));
      this.models.set(name, module);
    }
    try {
      this.connection = await connect(process.env.DB_STRING || "", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        autoIndex: true,
        useFindAndModify: false,
      });
    } catch (error) {
      console.error("\x1b[41m", "Es konnte keine Datenbankverbindung hergestellt werden!", "\x1b[0m");
      process.exit();
    }
  }
}
