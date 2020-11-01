/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

exports.Database = class {
  constructor(mongoose) {
    this.mongoose = mongoose;
    this.models = new Collection();
    this.loadModels();
  }

  get names() {
    return [...this.models.keys()];
  }

  get size() {
    return this.models.size;
  }

  get connection() {
    return this.mongoose;
  }

  get(model) {
    return this.models.get(model);
  }

  has(model) {
    return this.models.has(model);
  }

  delete(model) {
    return this.models.delete(model);
  }

  async loadModels() {
    const models = fs.readdirSync(path.join(__dirname, "..", "models"));
    for (const model of models) {
      const name = model.split(".")[0];
      if (/\w?#.+/.test(name)) continue;

      const module = await require(path.join(__dirname, "..", "models", name));
      this.models.set(name, module);

      await this.mongoose.model(name, module.schema);
    }
    try {
      await this.mongoose.connect(process.env.DB_STRING, {
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
};
