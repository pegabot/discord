/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandData, Collection, Interaction } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { walkSync } from "../../utils/walkSync";
import { Bot } from "../bot";
import { BotInteraction } from "./interaction";

export class InteractionHandler {
  interactions: Collection<string, BotInteraction> = new Collection();
  constructor(protected bot: Bot) {}

  get names() {
    return [...this.interactions.keys()];
  }

  get size() {
    return this.interactions.size;
  }

  get all() {
    return this.interactions;
  }

  get(interaction: string): BotInteraction | undefined {
    return this.interactions.get(interaction);
  }

  has(interaction: string): boolean {
    return this.interactions.has(interaction);
  }

  delete(interaction: string): boolean {
    return this.interactions.delete(interaction);
  }

  loadInterations(): void {
    const _interactions = fs.readdirSync(path.join(__dirname, "../../interactions"));
    const files = walkSync(_interactions, path.join(__dirname, "../../interactions"));

    for (const _interaction of files.filter((file) => !/.*map/.test(file))) {
      const category = path.dirname(_interaction).split(path.sep).pop() || [];

      try {
        const importedInteraction: any = require(_interaction);
        const interaction: BotInteraction = importedInteraction[Object.keys(importedInteraction)[0]];
        if (!interaction) continue;
        this.loadInteraction(interaction, (category as string) || "-");
      } catch (err) {
        throw err;
      }
    }

    this.registerInteraction();
    this.cleanInteractions();
  }

  checkInteraction(name: string): string | undefined {
    if (this.interactions.has(name)) return `Die Interaction ${name} existiert bereits.`;
  }

  loadInteraction(importedInteraction: BotInteraction, category: string) {
    const _cmd: any = importedInteraction;
    const cmd = new _cmd(this.bot);

    cmd.category = (category[0] || "").toUpperCase() + category.slice(1);

    const { name } = cmd;
    const error = this.checkInteraction(name);

    if (!error) {
      this.interactions.set(name.toLowerCase(), cmd);
    } else {
      this.bot.logger.error(error);
    }
  }

  registerInteraction(): void {
    const ineractionsData: ApplicationCommandData[] = this.interactions.array();
    this.bot.client.guilds.cache.get(this.bot.config.guildId)?.commands.set(ineractionsData);
  }

  async cleanInteractions(): Promise<void> {
    const globalInteractions = await this.bot.client.application?.commands.fetch();
    console.log(globalInteractions);
    globalInteractions?.forEach((interaction) => {
      interaction.delete();
    });

    const guildInteractions = await this.bot.client.guilds.cache.get(this.bot.config.guildId)?.commands.fetch();
    guildInteractions?.forEach((interaction) => {
      if (!this.interactions.has(interaction.name)) interaction.delete();
    });
  }

  handleInteraction(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    const foundInteration = this.interactions.get(interaction.commandName);
    if (!foundInteration) {
      interaction.reply("Ein interner Fehler ist aufgetreten!", { ephemeral: true });
    }
    foundInteration?.execute(interaction);
  }
}
