/*
 * Copyright (c) 2020 - 2021 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const fetch = require("node-fetch");

exports.module = (url, options = {}, timeout = 4000) => {
  return Promise.race([fetch(url, options), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeout))]);
};
