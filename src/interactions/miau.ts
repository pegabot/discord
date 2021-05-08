/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, MessageAttachment, TextChannel } from "discord.js";
import emojiStrip from "emoji-strip";
import querystring from "querystring";
import { InteractionCommand } from "../core/interactions/interactionCommand";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { findOption } from "../utils/interactions";

export class MiauInteraction extends InteractionCommand {
  name = "miau";
  description = "😻";
  options: ApplicationCommandOptionData[] = [{ required: false, name: "text", type: "STRING", description: "Eigener Text" }];

  async execute(interaction: CommandInteraction): Promise<void> {
    interaction.defer();

    let text = emojiStrip((findOption(interaction, "text")?.value as string) || "")
      .replace(/[^a-üA-Ü0-9-_]/g, " ")
      .trim()
      .split(" ")
      .filter((elt) => elt !== "");

    if (text.length < 1) text = ["miau"];

    try {
      const result: any = await fetchWithTimeout(
        `https://cataas.com/cat/says/${querystring.escape(text.join(" "))}?${new Date().getTime()}&size=50&color=white&type=large`,
      );
      const buffer = await result.buffer();
      interaction.editReply("😻");
      (interaction.channel as TextChannel).send(new MessageAttachment(buffer));
    } catch (e) {
      interaction.editReply(`<@${interaction.user.id}> es scheint so, als ob ich gerade keine Katzenbilder für dich laden kann 😿`);
    }
  }
}
