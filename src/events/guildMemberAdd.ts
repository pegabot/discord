/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { TextChannel } from "discord.js";
import bot from "../bot";
import { Event } from "../core/events/event";
import { GuildMemberEmbed } from "../utils/guildMemberEmbed";
import { stripIndents } from "../utils/stripIndents";

export default new Event("guildMemberAdd", (member) => {
  if (member.partial) return;

  const embed = GuildMemberEmbed(member);

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
