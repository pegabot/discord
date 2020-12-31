/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const fs = require("fs");
const path = require("path");

const utils = fs.readdirSync(path.join(__dirname, "utils"));
for (const util of utils) {
  const base = util.split(".")[0];
  const { module } = require(path.join(__dirname, "utils", base));
  exports[base] = module;
}
