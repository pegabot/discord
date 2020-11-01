/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

exports.Models = class {
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

  get(model) {
    return this.models.get(model);
  }

  has(model) {
    return this.models.has(model);
  }

  delete(model) {
    return this.models.delete(model);
  }

  loadModels() {
    const models = fs.readdirSync(path.join(__dirname, "..", "models"));
    for (const model of models) {
      const name = model.split(".")[0];
      if (/\w?#.+/.test(name)) continue;

      const module = require(path.join(__dirname, "..", "models", name));
      this.models.set(name, module);

      this.mongoose.model(name, module.schema);
    }
  }
};
