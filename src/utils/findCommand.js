/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.module = (commands = [], base = "") => {
  let command = commands.get(base);
  if (!command) {
    commands.forEach((elt) => {
      if (elt.aliases?.includes(base)) command = elt;
    });
  }
  return command;
};
