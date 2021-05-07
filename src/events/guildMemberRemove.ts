/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageEmbed, TextChannel } from "discord.js";
import bot from "../bot";
import { Event } from "../classes/event";
import { LevelModel } from "../models/levels";

export default new Event("guildMemberRemove", (member) => {
  if (member.partial) return;

  LevelModel.find({ userID: member.user.id }, (error, data) => {
    if (error) return;
    data.forEach((element) => {
      element.remove();
    });
  });

  const embed = new MessageEmbed().setTitle(`${member.user.tag} hat gerade den Server verlassen.`);

  const channel = bot.client.channels?.resolve(bot.config.goodbyeChannel || "");
  if (!channel) return;
  (channel as TextChannel).send(embed);
});
