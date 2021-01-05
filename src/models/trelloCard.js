/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { Schema } = require("mongoose");

const TrelloCardScheme = new Schema({
  created: { type: Number, default: Date.now },
  cardId: { type: String, unique: true },
  name: String,
  url: String,
  fields: Object,
});

exports.schema = TrelloCardScheme;
