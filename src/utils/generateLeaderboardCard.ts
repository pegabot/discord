/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { GuildMember } from "discord.js";
import Canvas from "./Canvas";
import { roundRect } from "./roundRect";
const Levels = require("discord-xp");

export const generateLeaderboardCard = async (leaderboard: any): Promise<Canvas.Canvas> => {
  const canvas = Canvas.createCanvas(700, 250 * leaderboard.length);
  const ctx = canvas.getContext("2d");
  for (let i = 0; i < leaderboard.length; i++) {
    const userData = leaderboard[i].userData;
    const user: GuildMember = leaderboard[i].user;

    const xpToNextLevel = Levels.xpFor(userData.level + 1);
    const xpForCurrentLevel = userData.level === 0 ? 0 : Levels.xpFor(userData.level);
    const xpLevelDif = Math.abs(xpToNextLevel - xpForCurrentLevel);
    const xpProgress = Math.abs(userData.xp - xpForCurrentLevel);
    const percentDone = xpProgress / xpLevelDif;
    if (i === 0) {
      ctx.fillStyle = "#1f2525a0";
      roundRect(ctx, 0, 0, canvas.width, canvas.height, 125);
      ctx.fillStyle = "#090b0b";
      const gap = 20;
      roundRect(ctx, gap, gap, canvas.width - gap * 2, canvas.height - gap * 2, 125);
    }

    const barWidth = canvas.width / 1.75;
    const barHeight = 25;

    const bary = 160;
    //xp bar
    ctx.fillStyle = "#484b4e";
    roundRect(ctx, canvas.width / 3, bary, barWidth, barHeight, barHeight / 2);
    ctx.fillStyle = "#c31503";
    roundRect(ctx, canvas.width / 3, bary, Math.max(barWidth * percentDone, barHeight), barHeight, barHeight / 2);

    ctx.font = "24px Poppins";
    ctx.fillStyle = "#ffffff";
    const name = `${user.nickname || user.user.username}${user.user.tag.slice(-5)}`;
    const nameWidth = ctx.measureText(name).width;
    if (nameWidth > canvas.width * 0.75) {
      ctx.font = "16px Poppins";
    }
    ctx.fillText(`${name}`, canvas.width / 3, 100);
    ctx.strokeStyle = "#c31503";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    const lineY = 112;
    ctx.moveTo(canvas.width / 3, lineY);
    ctx.lineTo(canvas.width - canvas.width / 5, lineY);
    ctx.stroke();
    ctx.font = "18px Poppins";
    const displayXp = xpProgress > 1000 ? `${(xpProgress / 1000).toFixed(2)}k` : Math.floor(xpProgress);
    const displayXpToGo = xpLevelDif > 1000 ? `${(xpLevelDif / 1000).toFixed(2)}k` : xpLevelDif;
    const xpText = `${displayXp}/${displayXpToGo} XP`;
    const xpTextWidth = ctx.measureText(xpText).width;
    ctx.fillStyle = "#dddddd";
    const textY = 145;
    ctx.fillText(xpText, canvas.width - xpTextWidth - 80, textY);
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Poppins";
    const levelText = `Level ${userData.level}`;
    const levelTextWidth = ctx.measureText(levelText).width;
    ctx.fillText(levelText, canvas.width / 3, textY);
    if (userData.rank) {
      ctx.fillText(`Rank ${userData.rank}`, canvas.width / 3 + levelTextWidth + 20, textY);
    }
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(125, 125, 100 / 1.25, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.clip();
    const profileUrl = user.user.displayAvatarURL({ format: "png" });
    const avatar = await Canvas.loadImage(profileUrl);
    ctx.drawImage(avatar, 25 * 1.75, 25 * 1.75, 200 / 1.25, 200 / 1.25);
    const statuses: any = {
      online: "https://cdn.discordapp.com/emojis/726982918064570400.png?v=1",
      idle: "https://cdn.discordapp.com/emojis/726982942181818450.png?v=1",
      dnd: "https://cdn.discordapp.com/emojis/726982954580181063.png?v=1",
      offline: "https://cdn.discordapp.com/emojis/702707414927015966.png?v=1",
    };
    ctx.restore();
    const iconWidth = 60;
    const statusUrl = statuses[user.presence.status] || "";
    const statusImage = await Canvas.loadImage(statusUrl);
    ctx.drawImage(statusImage, 25 * 1.75 + 200 / 1.25 - iconWidth / 1.15, 25 * 1.75 + 200 / 1.25 - iconWidth / 1.15, iconWidth, iconWidth);
    ctx.translate(0, 250);
  }
  return canvas;
};
