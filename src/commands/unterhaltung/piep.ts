/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { createCanvas, Image } from "canvas";
import { Message, MessageAttachment } from "discord.js";
import emojiStrip from "emoji-strip";
import { Command } from "../../classes/command";
import { fetchWithTimeout } from "../../utils/fetchWithTimeout";

export class className extends Command {
  name = "piep";
  usage = ["piep", "piep <text>"];
  help = "Liefert ein zufälliges Vogelbild zurück.";
  channel = ["718145438339039325"];

  async execute(msg: Message, args: string[]): Promise<void> {
    try {
      const responseJson: any = await fetchWithTimeout(`http://shibe.online/api/birds`);
      const json = await responseJson.json();

      const img: Image = await new Promise((resolve, reject) => {
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
        .slice((this.bot?.config?.prefix?.length || 1) + 4)
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
        const { width } = ctx.measureText(text);
        ctx.fillStyle = "black";
        const textX = (img.width - width) / 2;
        const textY = img.height - 20;
        ctx.fillText(text, textX, textY);
        ctx.strokeStyle = "white";
        ctx.strokeText(text, textX, textY);
      }
      const buffer = canvas.toBuffer("image/jpeg", { quality: 0.85, progressive: false, chromaSubsampling: true });
      msg.channel.send("", new MessageAttachment(buffer));
    } catch (e) {
      msg.channel.send(`<@${msg.author.id}> es scheint so, als ob ich gerade keine Vogelbilder für dich laden kann 🦜`);
    }
  }
}
