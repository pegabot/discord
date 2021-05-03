/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { userGivenRolesModel } from "../../models/userGivenRoles";
import { BotExecption } from "../../utils/execptions";

const expiresInterval = 1000 * 60 * 60 * 24; // Milliseconds * Seconds * Minutes * Hours

export class SpontansucheCommand extends Command {
  name = "spontansuche";
  usage = ["spontansuche"];
  help = "Dieser Command fügt dir eine Rolle hinzu/ entfernt dir eine Rolle, mit welcher du dich als spontan spielfähig kennzeichnen kannst.";

  execute(msg: Message): void {
    try {
      const { member } = msg;
      if (!member) throw new BotExecption("Ein Fehler ist aufgetreten!");

      const roleId = this.bot?.config?.playerSearchRole;
      if (!roleId) throw new BotExecption("Ein Fehler ist aufgetreten!");

      const userId = member.id;

      if (member.roles.cache.has(roleId)) {
        member.roles.remove(roleId);

        userGivenRolesModel.find({ userId: userId, roleId: roleId }, (error, data) => {
          data.forEach((entry) => entry.remove());
        });
        msg.reply("die Rolle wurde wieder entfernt.");
      } else {
        member.roles.add(roleId);
        const entry = new userGivenRolesModel();
        entry.userId = userId;
        entry.roleId = roleId;
        entry.expires = Number(Date.now()) + expiresInterval;
        entry.save();
        msg.reply("Rolle hinzugefügt.");
      }
    } catch (err) {
      throw new BotExecption("Rolle konnte nicht hinzugefügt/ entfernt werden!");
    }
  }
}
