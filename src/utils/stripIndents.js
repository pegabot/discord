/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.module = (input) => {
  return typeof input === "string" ? input.replace(/^[ \\t]+/gm, "") : input;
};
