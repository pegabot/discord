/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { de } from "date-fns/locale";
import { Collection, MessageEmbed, Role, TextChannel } from "discord.js";
import bot from "../bot";
import { Event } from "../classes/event";
import { stripIndents } from "../utils/stripIndents";

export default new Event("guildMemberAdd", (member) => {
  if (member.partial) return;

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

  const embed = new MessageEmbed()
    .setAuthor(member.user.tag, member.user.displayAvatarURL())
    .setThumbnail(member.user.displayAvatarURL())
    .setTitle(`${member.displayName} hat gerade den Server betreten!`)
    .setDescription(status[member.presence.status])
    .addField("Benutzername", member.user.username, true)
    .addField("Account erstellt", createdAt, true)
    .addField("Dem Server beigetreten", joinedAt, true)
    .addField("ID", member.id, true)
    .addField("Bot", member.user.bot ? "Bleep bxloop, ich bin ein Bot!" : "Dieser Benutzer ist kein Bot!", true)
    .addField(`Rollen [${size}]`, `\`${roles}\``);

  const channel = bot.client.channels.resolve(bot.config.welcomeChannel || "");
  if (!channel) return;
  (channel as TextChannel).send(embed);

  const lockTime = 1616968799000; // Sonntag, 28. März 2021 23:59:59 GMT+02:00 https://www.epochconverter.com
  const localTime = new Date().getTime();

  if (localTime > lockTime) return;

  bot.client.users.cache?.get(member.user.id)?.send(
    stripIndents(`
Willkommen bei der CONspiracy

Hier kannst du dich mit Freunden und weiteren Mitspielern austauschen, oder auch mit uns vom Pegasus-Spiele-Team in Kontakt treten. Ob mit oder ohne Voice-Chat – du hast die Wahl!
Die CONspiracy ist eine Online-Spiele-Convention von Pegasus Spiele. Während der Convention werden Brett- und Kartenspiele auf Tabletopia und Rollenspielrunden auf dem Discord-Server angeboten. Zudem gibt es Livestreams zu Lesungen, Talkrunden, Workshops und Let’s Plays. Nach den drei erfolgreichen Conventions, ist auch schon die CONspiracy 5 Meets GRT eingeplant: vom 26. bis zum 28.03.2021!

Dein Pegabot
------

Welcome to the CONspiracy!
You can interact with friends and other players, or get in touch with us from the Pegasus Spiele-team. 
The CONspiracy is an online gaming convention provided by Pegasus Spiele. During this convention board- and card games on Tabletopia and roleplaying rounds on the discord server are offered. Live streams with readings, talk shows, workshops and Let’s Plays are provided as well. And there’s even better news: After three successful convention, the CONspiracy comes with CONspiracy 5: from 26th to 28th of March 2021!,

Your Pegabot`),
  );
});
