/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteractionOption } from "discord.js";

export const findOption = (options: CommandInteractionOption[], name: string) => {
  return options.find((option) => option.name.toLowerCase() === name.toLowerCase());
};
