/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { BotExecption } from "../../utils/execptions";

export class SubscribeCommand extends Command {
  name = "subscribe";
  usage = ["subscribe"];
  help = "Dieser Command fügt dir eine Rolle hinzu/ entfernt dir eine Rolle, welche verwendet wird, um dich bei Neuigkeiten zu informieren.";

  execute(msg: Message): void {
    try {
      const { member } = msg;
      if (!member) throw new BotExecption("Ein Fehler ist aufgetreten!");

      if (member.roles.cache.has(this.bot?.config?.notificationRole || "")) {
        member.roles.remove(this.bot?.config?.notificationRole || "");
        msg.reply("Rolle entfernt. Du wirst nicht weiter informiert.");
      } else {
        member.roles.add(this.bot?.config?.notificationRole || "");
        msg.reply("Rolle hinzugefügt. Du wirst ab sofort informiert.");
      }
    } catch (err) {
      throw new BotExecption("Rolle konnte nicht hinzugefügt/ entfernt werden!");
    }
  }
}
