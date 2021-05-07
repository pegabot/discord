/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction } from "discord.js";

export const findOption = (interaction: CommandInteraction, name: string) => {
  return interaction.options.find((option) => option.name.toLowerCase() === name.toLowerCase());
};
