/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandData, ApplicationCommandOptionData, Collection, GuildApplicationCommandPermissionData, GuildMember, Interaction } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { LogModel } from "../../models/log";
import { getRolesByInteractionPermissionsAndGuild } from "../../utils/interactions";
import { walkSync } from "../../utils/walkSync";
import { Bot } from "../bot";
import { InteractionCommand, InteractionErrors } from "./interactionCommand";

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

  async loadInterations(): Promise<void> {
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

    await this.registerInteraction();
    await this.cleanInteractions();
    this.setupPermission();
  }

  checkInteraction(name: string, description: string, options?: ApplicationCommandOptionData[]): string | undefined {
    if (name.length < 1) return "Der Name einer Interaction ist leer!";
    if (description.length < 1) return `Die Beschreibung der Interaction ${name} darf nicht leer sein!`;
    if (this.interactions.has(name)) return `Die Interaction ${name} existiert bereits.`;
    if (name !== name.toLowerCase()) return `Der Name der Interaction ${name} muss kleingeschrieben werden!`;

    for (const option of options || []) {
      if (option.name.length < 1) return "Der Name für eine Option der Interaction ${name} ist leer!";
      if (option.description.length < 1) return "Die Beschreibung für eine Option der Interaction ${name} ist leer!";
      if (option.name !== option.name.toLowerCase()) return `Die Option ${option.name} für die Interaction ${name} muss kleingeschrieben werden!`;
    }
  }

  loadInteraction(importedInteraction: InteractionCommand, category: string) {
    const _interactionCommand: any = importedInteraction;
    const interactionCommand: InteractionCommand = new _interactionCommand(this.bot);

    const { name, description, options } = interactionCommand;
    const error = this.checkInteraction(name, description, options);

    if (!error) {
      this.interactions.set(name.toLowerCase(), interactionCommand);
    } else {
      this.bot.logger.error(error);
    }
  }

  async registerInteraction() {
    const interactionsData: ApplicationCommandData[] = this.interactions.array();
    try {
      const createdInteractions = await this.bot.client.guilds.cache.get(this.bot.config.guildId)?.commands.set(
        interactionsData.map((elt: ApplicationCommandData) => {
          return { name: elt.name, description: elt.description, options: elt.options };
        }),
      );

      createdInteractions?.array().forEach((interaction) => {
        const _interaction = this.interactions.get(interaction.name);
        if (!_interaction) return;

        _interaction.id = interaction.id;
      });
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

  setupPermission(): void {
    let permissonData: GuildApplicationCommandPermissionData[] = [];

    this.interactions.forEach(async (interaction) => {
      if (interaction.permissions.length < 1) return;
      if (!interaction.id) return;

      const guild = this.bot.client.guilds.cache.get(this.bot.config.guildId);
      if (!guild) return;

      const roles = getRolesByInteractionPermissionsAndGuild(guild, interaction);

      permissonData.push({
        id: interaction.id,
        permissions: roles.map((role) => {
          return {
            id: role.id,
            type: "ROLE",
            permission: true,
          };
        }),
      });

      try {
        await this.bot.client.guilds.cache.get(this.bot.config.guildId)?.commands.setPermissions(permissonData);
      } catch (err) {
        console.log(err);
      }
    });
  }

  async handleInteraction(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    const foundInteration = this.interactions.get(interaction.commandName);
    if (!foundInteration) return interaction.reply(InteractionErrors.INTERNAL_ERROR, { ephemeral: true });

    if (!interaction.guild) return interaction.reply(InteractionErrors.INTERNAL_ERROR, { ephemeral: true });
    const interactionRoles = getRolesByInteractionPermissionsAndGuild(interaction.guild, foundInteration);

    if (foundInteration.permissions.length > 0) {
      const foundPermission = interactionRoles.array().filter((role) => {
        const member: GuildMember = interaction.member;

        return member.roles.cache
          .array()
          .map((role) => role.name)
          .includes(role.name);
      }).length;

      if (foundPermission < 1) return interaction.reply(InteractionErrors.MISSING_PERMISSIONS, { ephemeral: true });
    }

    const entry = new LogModel();
    entry.interaction = JSON.parse(JSON.stringify(interaction));
    entry.author = JSON.parse(JSON.stringify(interaction.user));
    entry.save();

    foundInteration?.execute(interaction);
  }
}
