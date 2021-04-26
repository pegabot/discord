/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { GuildMember, Message, MessageEmbed, MessageReaction, User } from "discord.js";

const defEmojiList = [
  "\u0031\u20E3",
  "\u0032\u20E3",
  "\u0033\u20E3",
  "\u0034\u20E3",
  "\u0035\u20E3",
  "\u0036\u20E3",
  "\u0037\u20E3",
  "\u0038\u20E3",
  "\u0039\u20E3",
  "\uD83D\uDD1F",
];

export const pollEmbed = async (
  msg: Message,
  title: string,
  options: string[],
  timeout = 30,
  emojiList = defEmojiList.slice(),
  forceEndPollEmoji = "\u2705",
) => {
  if (!msg.channel) return msg.reply("Der Kanal ist nicht erreichbar.");

  if (options.length < 2) return msg.reply("bitte übergebe mehr als eine Antwortmöglichkeit.");
  if (options.length > emojiList.length) return msg.reply(`bitte übergebe nur ${emojiList.length} oder weniger Antwortmöglichkeiten.`);

  let text = `*Um abzustimmen, reagiere mit dem entsprechenden Emoji.\nDie Abstimmung endet in **${timeout} Sekunden**.\nDer Ersteller der Abstimmung kann diese, durch reagieren auf das ${forceEndPollEmoji} Emojji, **friedlich** beenden.*\n\n`;
  const emojiInfo: any = {};
  for (const option of options) {
    const emoji = emojiList.splice(0, 1)[0];
    emojiInfo[emoji] = { option: option, votes: 0 };
    text += `${emoji} : \`${option}\`\n\n`;
  }
  const usedEmojis = Object.keys(emojiInfo);
  usedEmojis.push(forceEndPollEmoji);

  const poll: any = await msg.channel.send(embedBuilder(title, msg.author.tag).setDescription(text));
  for (const emoji of usedEmojis) await poll.react(emoji);

  const reactionCollector = poll.createReactionCollector(
    (reaction: MessageReaction, user: User) => usedEmojis.includes(reaction.emoji.name) && !user.bot,
    timeout === 0 ? {} : { time: timeout * 1000 },
  );
  const voterInfo = new Map();
  reactionCollector.on("collect", (reaction: MessageReaction, user: GuildMember) => {
    if (usedEmojis.includes(reaction.emoji.name)) {
      if (reaction.emoji.name === forceEndPollEmoji && msg.author.id === user.id) return reactionCollector.stop();
      if (!voterInfo.has(user.id)) voterInfo.set(user.id, { emoji: reaction.emoji.name });
      const votedEmoji = voterInfo.get(user.id).emoji;
      if (votedEmoji !== reaction.emoji.name) {
        const lastVote = poll.reactions.get(votedEmoji);
        lastVote.count -= 1;
        lastVote.users.remove(user.id);
        emojiInfo[votedEmoji].votes -= 1;
        voterInfo.set(user.id, { emoji: reaction.emoji.name });
      }
      emojiInfo[reaction.emoji.name].votes += 1;
    }
  });

  reactionCollector.on("dispose", (reaction: MessageReaction, user: GuildMember) => {
    if (usedEmojis.includes(reaction.emoji.name)) {
      voterInfo.delete(user.id);
      emojiInfo[reaction.emoji.name].votes -= 1;
    }
  });

  reactionCollector.on("end", () => {
    text = "*Ding! Ding! Ding! Die Zeit ist rum!\n Hier sind die Ergebnisse,*\n\n";
    for (const emoji in emojiInfo) text += `\`${emojiInfo[emoji].option}\` - \`${emojiInfo[emoji].votes}\`\n\n`;
    poll.delete();
    msg.channel.send(embedBuilder(title, msg.author.tag).setDescription(text));
  });
};

const embedBuilder = (title: string, author: string) => {
  return new MessageEmbed().setTitle(`Abstimmung - ${title}`).setFooter(`Abstimmung erstellt von ${author}`);
};
