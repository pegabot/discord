/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { stripIndents } = require("../utils");

exports.Logger = class {
  info(msg) {
    console.log(stripIndents(msg));
  }

  error(msg) {
    console.error("⚠️ \x1b[31m%s\x1b[0m", stripIndents(msg));
  }
};
