/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandData, ApplicationCommandOptionData, Collection, Interaction } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { LogModel } from "../../models/log";
import { walkSync } from "../../utils/walkSync";
import { Bot } from "../bot";
import { InteractionCommand } from "./interactionCommand";

export class interactionHandler {
  interactions: Collection<string, InteractionCommand> = new Collection();
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

  get(interaction: string): InteractionCommand | undefined {
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
        const interaction: InteractionCommand = importedInteraction[Object.keys(importedInteraction)[0]];
        if (!interaction) continue;
        this.loadInteraction(interaction, (category as string) || "-");
      } catch (err) {
        throw err;
      }
    }

    this.registerInteraction();
    this.cleanInteractions();
  }

  checkInteraction(name: string, options?: ApplicationCommandOptionData[]): string | undefined {
    if (this.interactions.has(name)) return `Die Interaction ${name} existiert bereits.`;
    if (name !== name.toLowerCase()) return `Der Name der Interaction ${name} muss kleingeschrieben werden!`;

    for (const option of options || []) {
      if (option.name !== option.name.toLowerCase()) return `Die Option ${option.name} für die Interaction ${name} muss kleingeschrieben werden!`;
    }
  }

  loadInteraction(importedInteraction: InteractionCommand, category: string) {
    const _interactionCommand: any = importedInteraction;
    const interactionCommand: InteractionCommand = new _interactionCommand(this.bot);

    const { name, options } = interactionCommand;
    const error = this.checkInteraction(name, options);

    if (!error) {
      this.interactions.set(name.toLowerCase(), interactionCommand);
    } else {
      this.bot.logger.error(error);
    }
  }

  async registerInteraction() {
    const interactionsData: ApplicationCommandData[] = this.interactions.array();
    try {
      await this.bot.client.guilds.cache.get(this.bot.config.guildId)?.commands.set(
        interactionsData.map((elt: ApplicationCommandData) => {
          return { name: elt.name, description: elt.description, options: elt.options };
        }),
      );
    } catch (error) {
      console.log(error);
    }
  }

  async cleanInteractions(): Promise<void> {
    const globalInteractions = await this.bot.client.application?.commands.fetch();
    globalInteractions?.forEach((interaction) => {
      interaction.delete();
    });

    const guildInteractions = await this.bot.client.guilds.cache.get(this.bot.config.guildId)?.commands.fetch();
    guildInteractions?.forEach((interaction) => {
      if (!this.interactions.has(interaction.name)) {
        interaction.delete();
      }
    });
  }

  async handleInteraction(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    const foundInteration = this.interactions.get(interaction.commandName);
    if (!foundInteration) {
      interaction.reply("Ein interner Fehler ist aufgetreten!", { ephemeral: true });
    }

    const entry = new LogModel();
    entry.interaction = JSON.parse(JSON.stringify(interaction));;
    entry.author = JSON.parse(JSON.stringify(interaction.user));
    entry.save();

    foundInteration?.execute(interaction);
  }
}
