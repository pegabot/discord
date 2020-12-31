/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const fetch = require("node-fetch");

exports.module = (url, options = {}, timeout = 4000) => {
  return Promise.race([fetch(url, options), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeout))]);
};
