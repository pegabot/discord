const { stripIndents } = require("../utils");

exports.run = (bot, member) => {
  // bot.channels.resolve(bot.config.welcomeChannel).send(
  //   stripIndents(`
  //       Wilkommen an Bord ${member}!`),
  // );

  bot.channels.resolve(bot.config.modLog).send(stripIndents(`${member} hat gerade den Server betreten!`));

  bot.users.cache.get(member.user.id).send(
    stripIndents(`
Willkommen bei der CONspiracy

Hier kannst du dich mit Freunden und weiteren Mitspielern austauschen, oder auch mit uns vom Pegasus-Spiele-Team in Kontakt treten. Ob mit oder ohne Voice-Chat – du hast die Wahl!
Die CONspiracy ist eine Online-Spiele-Convention von Pegasus Spiele. Während der Convention werden Brett- und Kartenspiele auf Tabletopia und Rollenspielrunden auf dem Discord-Server angeboten. Zudem gibt es Livestreams zu Lesungen, Talkrunden, Workshops und Let’s Plays. Nach den drei erfolgreichen Conventions, ist auch schon die CONspiracy 4 eingeplant: vom 27. bis zum 29.11.2020!

Dein Pegabot
------

Welcome to the CONspiracy!
You can interact with friends and other players, or get in touch with us from the Pegasus Spiele-team. 
The CONspiracy is an online gaming convention provided by Pegasus Spiele. During this convention board- and card games on Tabletopia and roleplaying rounds on the discord server are offered. Live streams with readings, talk shows, workshops and Let’s Plays are provided as well. And there’s even better news: After three successful convention, the CONspiracy comes with CONspiracy 4: from 27th to 29th of November 2020!,

Your Pegabot`),
  );
};
