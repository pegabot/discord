/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { fetchWithTimeout } = require("./../../utils");
const { MessageAttachment } = require("discord.js");
const { Image, createCanvas, loadImage } = require("canvas");
const emojiStrip = require("emoji-strip");

module.exports = {
  name: "piep",
  usage: ["piep", "piep <text>"],
  help: "Liefert ein zufälliges Vogelbild zurück.",
  channel: ["718145438339039325"],
  execute: async (bot, msg) => {
    try {
      const responseJson = await fetchWithTimeout(`http://shibe.online/api/birds`);
      const json = await responseJson.json();
      /* @type {Image} */
      const img = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.onerror = reject;
        img.src = json[0];
      });
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const text = emojiStrip(msg.cleanContent)
        .replace(/[^a-üA-Ü0-9-_]/g, " ")
        .slice(bot.config.prefix.length + 4)
        .trim()
        .split(" ")
        .filter((elt) => elt !== "")
        .map((t) => t.trim())
        .join(" ");
      if (text) {
        ctx.font = "bold 34px sans-serif";
        ctx.shadowColor = "white";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 15;
        const { width, emHeightAscent } = ctx.measureText(text);
        ctx.fillStyle = "black";
        const textX = (img.width - width) / 2;
        const textY = img.height - (emHeightAscent + 20);
        ctx.fillText(text, textX, textY);
        ctx.strokeStyle = "white";
        ctx.strokeText(text, textX, textY);
      }
      const buffer = canvas.toBuffer("image/jpeg", { quality: 0.85, progressive: false, chromaSubsampling: true });
      msg.channel.send("", new MessageAttachment(buffer));
    } catch (e) {
      msg.channel.send(`<@${msg.author.id}> es scheint so, als ob ich gerade keine Vogelbilder für dich laden kann 🦜`);
    }
  },
};
