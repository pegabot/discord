/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { createCanvas, Image } from "canvas";
import { ApplicationCommandOptionData, CommandInteraction, MessageAttachment, TextChannel } from "discord.js";
import emojiStrip from "emoji-strip";
import { InteractionCommand } from "../core/interactions/interactionCommand";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { findOption } from "../utils/interactions";

export class PiepInteraction extends InteractionCommand {
  name = "piep";
  description = "🦜";
  options: ApplicationCommandOptionData[] = [{ required: false, name: "text", type: "STRING", description: "Eigener Text" }];

  async execute(interaction: CommandInteraction): Promise<void> {
    interaction.defer();

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

      const text = emojiStrip((findOption(interaction, "text")?.value as string) || "")
        .replace(/[^a-üA-Ü0-9-_]/g, " ")
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

      interaction.editReply("🦜");
      (interaction.channel as TextChannel).send(new MessageAttachment(buffer));
    } catch (e) {
      interaction.editReply(`<@${interaction.user.id}> es scheint so, als ob ich gerade keine Vogelbilder für dich laden kann 🦜`);
    }
  }
}
