/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Collection } from "discord.js";
import { BotCommand } from "../classes/command";

export const findCommand = (commands: Collection<string, BotCommand> = new Collection(), base = ""): BotCommand | undefined => {
  let command = commands.get(base);
  if (!command) {
    commands.forEach((elt) => {
      if (elt.aliases?.includes(base)) command = elt;
    });
  }
  return command;
};
