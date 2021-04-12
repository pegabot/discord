/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Invite } from "discord.js";
import { Event } from "../classes/event";

export class inviteDeleteEvent extends Event {
  execute(invite: Invite): void {
    this.bot.logger.admin_red(`:outbox_tray: Die Einladung: ${invite.url} **wurde gelöscht**.`, `Code: ${invite.code}`);
  }
}
