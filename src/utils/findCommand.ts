/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Collection } from "discord.js";
import { Command } from "../core/commands/command";

export const findCommand = (commands: Collection<string, Command> = new Collection(), base = ""): Command | undefined => {
  let command = commands.get(base);
  if (!command) {
    commands.forEach((elt) => {
      if (elt.aliases?.includes(base)) command = elt;
    });
  }
  return command;
};
