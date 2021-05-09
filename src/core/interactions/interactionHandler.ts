/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandData, Collection, GuildApplicationCommandPermissionData, GuildMember, Interaction } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { LogModel } from "../../models/log";
import { isProduction } from "../../utils/environment";
import { getRolesByPermissionsAndGuild } from "../../utils/permissions";
import { walkSync } from "../../utils/walkSync";
import { Bot } from "../bot";
import { InteractionCommand, InteractionCommandErrors, Subcommand } from "./interactionCommand";

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

  get(InteractionCommandName: string): InteractionCommand | undefined {
    return this.interactions.get(InteractionCommandName);
  }

  has(InteractionCommandName: string): boolean {
    return this.interactions.has(InteractionCommandName);
  }

  delete(InteractionCommandName: string): boolean {
    return this.interactions.delete(InteractionCommandName);
  }

  async loadInterationCommands(): Promise<void> {
    const _interactions = fs.readdirSync(path.join(__dirname, "../../InteractionCommands"));
    const files = walkSync(_interactions, path.join(__dirname, "../../InteractionCommands"));

    for (const _interaction of files.filter((file) => !/.*map/.test(file))) {
      const category = path.dirname(_interaction).split(path.sep).pop() || [];

      try {
        const importedInteractionCommands: any = require(_interaction);
        const interaction: InteractionCommand = importedInteractionCommands[Object.keys(importedInteractionCommands)[0]];
        if (!interaction) continue;
        this.loadInteractionCommand(interaction);
      } catch (err) {
        throw err;
      }
    }

    await this.registerInteractionCommand();
    await this.cleanInteractions();
    this.setupPermission();
  }

  private loadInteractionCommand(ImportedInteractionCommand: InteractionCommand) {
    const _interactionCommand: any = ImportedInteractionCommand;
    const interactionCommand: InteractionCommand = new _interactionCommand(this.bot);

    const { name } = interactionCommand;
    const error = this.checkInteractionCommand(interactionCommand);

    if (!error) {
      this.interactions.set(name.toLowerCase(), interactionCommand);
    } else {
      this.bot.logger.error(error);
    }
  }

  private checkInteractionCommand(InteractionCommand: InteractionCommand): string | undefined {
    if (InteractionCommand.name.length < 1) return "Der Name einer Interaction ist leer!";
    if (InteractionCommand.description.length < 1) return `Die Beschreibung der Interaction ${name} darf nicht leer sein!`;
    if (this.interactions.has(InteractionCommand.name)) return `Die Interaction ${name} existiert bereits.`;
    if (InteractionCommand.name !== InteractionCommand.name.toLowerCase()) return `Der Name der Interaction ${name} muss kleingeschrieben werden!`;

    for (const option of InteractionCommand.options || []) {
      if (option.name.length < 1) return "Der Name für eine Option der Interaction ${name} ist leer!";
      if (option.description.length < 1) return "Die Beschreibung für eine Option der Interaction ${name} ist leer!";
      if (option.name !== option.name.toLowerCase()) return `Die Option ${option.name} für die Interaction ${name} muss kleingeschrieben werden!`;
    }

    for (const option of InteractionCommand.options?.filter((option) => option.type === "SUB_COMMAND") || []) {
      if (!InteractionCommand.subcommands?.map((subcommand) => subcommand.name).includes(option.name))
        return `Der Subcommand ${option.name} für die Interaction ${name} wurde nicht implementiert!`;
    }
  }

  private async registerInteractionCommand() {
    const InteractionCommandData: ApplicationCommandData[] = this.interactions.array();
    try {
      const createdInteractionCommands = await this.bot.client.guilds.cache.get(this.bot.config.guildId)?.commands.set(
        InteractionCommandData.map((data: ApplicationCommandData) => {
          return { name: data.name, description: data.description, options: data.options, defaultPermission: data.defaultPermission };
        }),
      );

      createdInteractionCommands?.array().forEach((InteractionCommand) => {
        const _InteractionCommand = this.interactions.get(InteractionCommand.name);
        if (!_InteractionCommand) return;

        _InteractionCommand.id = InteractionCommand.id;
      });
    } catch (error) {
      console.log(error);
    }
  }

  private async cleanInteractions(): Promise<void> {
    const GlobalInteractionCommands = await this.bot.client.application?.commands.fetch();
    GlobalInteractionCommands?.forEach((InteractionCommand) => {
      InteractionCommand.delete();
    });

    const GuildInteractionCommands = await this.bot.client.guilds.cache.get(this.bot.config.guildId)?.commands.fetch();
    GuildInteractionCommands?.forEach((InteractionCommand) => {
      if (!this.interactions.has(InteractionCommand.name)) {
        InteractionCommand.delete();
      }
    });
  }

  private async setupPermission(): Promise<void> {
    try {
      let permissonData: GuildApplicationCommandPermissionData[] = [];

      this.interactions.forEach((InteractionCommand) => {
        if (InteractionCommand.permissions.length < 1) return;
        if (!InteractionCommand.id) return;

        const guild = this.bot.client.guilds.cache.get(this.bot.config.guildId);
        if (!guild) return;

        const roles = getRolesByPermissionsAndGuild(guild, InteractionCommand.permissions);

        //  This is very useful for a possible debugging ! //

        // console.log(
        //   JSON.stringify(
        //     {
        //       name: InteractionCommand.name,
        //       perms: InteractionCommand.permissions,
        //       roles: roles.map((role) => {
        //         return {
        //           name: role.name,
        //           pos: role.position,
        //         };
        //       }),
        //     },
        //     null,
        //     2,
        //   ),
        // );

        permissonData.push({
          id: InteractionCommand.id,
          permissions: roles
            .sort((a, b) => b.position - a.position)
            .slice(0, 10)
            .map((role) => {
              return {
                id: role.id,
                type: "ROLE",
                permission: true,
              };
            }),
        });
      });

      await this.bot.client.guilds.cache.get(this.bot.config.guildId)?.commands.setPermissions(permissonData);
    } catch (err) {
      console.log(err.message);
    }
  }

  async handleInteraction(interaction: Interaction) {
    if (!interaction.isCommand()) return;

    const InteractionCommand = this.interactions.get(interaction.commandName);
    if (!InteractionCommand) return interaction.reply(InteractionCommandErrors.INTERNAL_ERROR, { ephemeral: true });

    if (!interaction.guild) return interaction.reply(InteractionCommandErrors.INTERNAL_ERROR, { ephemeral: true });

    const OptionsOfSubcommand = interaction.options.find((option) => option.type === "SUB_COMMAND");
    let Subcommand: Subcommand | undefined;
    if (OptionsOfSubcommand) {
      Subcommand = InteractionCommand.subcommands.find((_Subcommand) => _Subcommand.name === OptionsOfSubcommand.name);
    }

    const interactionRoles = getRolesByPermissionsAndGuild(interaction.guild, InteractionCommand.permissions);

    if (InteractionCommand.permissions.length > 0) {
      const foundPermission = interactionRoles.filter((role) => {
        const member: GuildMember = interaction.member;

        return member.roles.cache
          .array()
          .map((role) => role.name)
          .includes(role.name);
      }).length;

      if (foundPermission < 1) return interaction.reply(InteractionCommandErrors.MISSING_PERMISSIONS, { ephemeral: true });
    }

    const entry = new LogModel();
    entry.interaction = JSON.parse(JSON.stringify(interaction));
    entry.author = JSON.parse(JSON.stringify(interaction.user));
    entry.save();

    try {
      Subcommand ? await Subcommand.execute(interaction, OptionsOfSubcommand?.options) : await InteractionCommand?.execute(interaction, interaction.options);
    } catch (error) {
      interaction.deferred ? interaction.editReply(InteractionCommandErrors.INTERNAL_ERROR) : interaction.reply(InteractionCommandErrors.INTERNAL_ERROR);

      this.bot.logger.admin_error(error, `Fehler in Interaction ${interaction.commandName}`);

      if (isProduction()) return;
      console.error(error);
    }
  }
}
