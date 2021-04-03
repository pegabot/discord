/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message } from "discord.js";
import { BotCommand } from "../../classes/command";
import { BotExecption } from "../../utils/BotExecption";

export class SubscribeCommand extends BotCommand {
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