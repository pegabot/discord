/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction } from "discord.js";
import { BotInteraction } from "../../core/interactions/interaction";

export class NicknameInteraction extends BotInteraction {
  name = "nickname";
  description = "Nicknamen auf diesem Server setzen";
  options = [{ name: "name", type: "STRING", description: "Der Name, der gesetzt werden soll" }];

  execute(interaction: CommandInteraction) {
    if (!interaction.options) {
      interaction.member.setNickname("");
      interaction.reply("Dein Nickname auf diesem Server wurde zurückgesetzt.", { ephemeral: true });
    } else {
      if (!interaction.member) return;

      if (interaction.member.permissions.has("ADMINISTRATOR"))
        return interaction.reply("hey! Du bist Admin 😄 deinen Nicknamen kann ich nicht bearbeiten!", { ephemeral: true });

      const option = interaction.options.find((option) => option.name === "name");

      if (!option)
        return interaction.reply(
          `du musst einen Nicknamen mit übergeben, mit \`${this.bot.config.prefix}nickname remove\` kannst du deinen Nickname entfernen.`,
          { ephemeral: true },
        );

      interaction.member.setNickname(option.value);
      interaction.reply("der Nickname wurde geändert", { ephemeral: true });
    }
  }
}
