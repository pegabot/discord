/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction, GuildMember } from "discord.js";
import { InteractionCommand } from "../core/interactions/interactionCommand";
import { userGivenRolesModel } from "../models/userGivenRoles";

const expiresInterval = 1000 * 60 * 60 * 24; // Milliseconds * Seconds * Minutes * Hours

export class SpontansucheInteraction extends InteractionCommand {
  name = "spontansuche";
  description = "Melde dich als spontan spielbereit.";

  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.defer();

    const { member } = interaction;

    const roleId = this.bot?.config?.playerSearchRole;
    if (!roleId) throw Error("Rolle nicht gefunden");

    const userId = (member as GuildMember).id;

    if ((member as GuildMember).roles.cache.has(roleId)) {
      (member as GuildMember).roles.remove(roleId);

      userGivenRolesModel.find({ userId: userId, roleId: roleId }, (error, data) => {
        data.forEach((entry) => entry.remove());
      });

      interaction.editReply("Die Rolle wurde wieder entfernt.");
    } else {
      (member as GuildMember).roles.add(roleId);
      const entry = new userGivenRolesModel();
      entry.userId = userId;
      entry.roleId = roleId;
      entry.expires = Number(Date.now()) + expiresInterval;
      entry.save();
      interaction.editReply("Die Rolle wurde hinzugefügt.");
    }
  }
}
