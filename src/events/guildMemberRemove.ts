/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { GuildMember, MessageEmbed, TextChannel } from "discord.js";
import { Event } from "../classes/event";
import { LevelModel } from "../models/levels";

export class guildMemberRemoveEvent extends Event {
  execute(member: GuildMember): void {
    if (member.partial) return;

    LevelModel.find({ userID: member.user.id }, (error, data) => {
      if (error) return;
      data.forEach((element) => {
        element.remove();
      });
    });

    const embed = new MessageEmbed().setTitle(`${member.user.tag} hat gerade den Server verlassen.`);

    const channel = this.bot.client.channels?.resolve(this.bot.config.goodbyeChannel || "");
    if (!channel) return;
    (channel as TextChannel).send(embed);
  }
}
