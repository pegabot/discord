/*
 * Copyright (c) 2020 - 2021 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const fs = require("fs");
const path = require("path");

const utils = fs.readdirSync(path.join(__dirname, "utils"));
for (const util of utils) {
  const base = util.split(".")[0];
  const { module } = require(path.join(__dirname, "utils", base));
  exports[base] = module;
}
