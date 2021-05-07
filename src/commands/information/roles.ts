/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../constants/colors";
import { Command } from "../../core/commands/command";

export class RolesCommand extends Command {
  name = "roles";
  aliases = ["rollen"];
  help = "Zeige alle Rollen des Server an";
  usage = "roles";

  execute(msg: Message): void {
    const roles = msg.guild?.roles.cache
      .array()
      .filter((role) => !role.managed && role.name !== "@everyone")
      .sort((a, b) => b.rawPosition - a.rawPosition);

    const embed = new MessageEmbed()
      .setAuthor(this.bot.client.user?.username, this.bot.client.user?.displayAvatarURL())
      .setThumbnail(msg?.guild?.iconURL() || "")
      .setTitle(`Rollen in ${msg.guild?.name}`)
      .setDescription(roles?.map((role) => `${role}\n`).join(""))
      .setColor(colors.orange)
      .setFooter(`Rollen: ${roles?.length}`)
      .setTimestamp(new Date());
    msg.channel.send(embed);
  }
}
