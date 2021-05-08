/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Collection, GuildMember, MessageEmbed, Role } from "discord.js";

export const GuildMemberEmbed = (member: GuildMember): MessageEmbed => {
  const status: any = {
    online: `Benutzer ist online!`,
    idle: `Benutzer macht Pause, wahrscheinlich trinkt er gerade eine Tasse Tee`,
    offline: `Benutzer ist offline, wahrscheinlich am schlafen`,
    dnd: `Dieser Benutzer möchte gerade nicht gestört werden`,
  };

  const createdAt = formatDistanceToNow(member.user.createdAt, {
    addSuffix: true,
    locale: de,
  });

  const joinedAt = member.joinedAt ? formatDistanceToNow(member.joinedAt, { addSuffix: true }) : "";
  let roles: string | Collection<string, Role> | undefined = "Dieser Benutzer verfügt über keine speziellen Rollen";
  let size = 0;
  if (member.roles.cache.size !== 1) {
    roles = member.roles.cache.filter((role) => role.name !== "@everyone");
    ({ size } = roles);
    if (roles.size !== 1) {
      roles = `${roles
        .array()
        .slice(0, -1)
        .map((r: Role) => r.name)
        .join(", ")} und ${roles?.last()?.name}`;
    } else {
      roles = roles?.first()?.name;
    }
  }
  return new MessageEmbed()
    .setAuthor(member.user.tag, member.user.displayAvatarURL())
    .setThumbnail(member.user.displayAvatarURL())
    .setTitle(`Informationen zu ${member.displayName}`)
    .setDescription(status[member.presence.status])
    .addField("Benutzername", member.user.username, true)
    .addField("Account erstellt", createdAt, true)
    .addField("Dem Server beigetreten", joinedAt, true)
    .addField("ID", member.id, true)
    .addField("Bot", member.user.bot ? "Bleep bxloop, ich bin ein Bot!" : "Dieser Benutzer ist kein Bot!", true)
    .addField(`Rollen [${size}]`, `\`${roles}\``);
};
