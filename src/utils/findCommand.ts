/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Collection } from "discord.js";
import { Command } from "../classes/command";

export const findCommand = (commands: Collection<string, Command> = new Collection(), base = ""): Command | undefined => {
  let command = commands.get(base);
  if (!command) {
    commands.forEach((elt) => {
      if (elt.aliases?.includes(base)) command = elt;
    });
  }
  return command;
};
