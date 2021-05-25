/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { HosttargetMessage } from "dank-twitch-irc";
import { Client, ClientEvents, CommandInteraction, MessageReaction, User } from "discord.js";
import { InteractionCommand } from "../core/interactions/interactionCommand";

type handleWelcomeMessageTypes = "add" | "remove";

interface CustomClientEvents extends ClientEvents {
  removeMessageFromDatabase: [string];
  handleReroll: [MessageReaction, User];
  handleCommandRepeat: [MessageReaction, User];
  handleWelcomeMessage: [handleWelcomeMessageTypes, MessageReaction, User];
  handleTwitch: [HosttargetMessage?];
  pruneChannel: [InteractionCommand, CommandInteraction, number];
}

export class CustomClient extends Client {
  public emit<K extends keyof CustomClientEvents>(event: K, ...args: CustomClientEvents[K]): boolean;
  public emit<S extends string | symbol>(event: Exclude<S, keyof CustomClientEvents>, ...args: any[]): boolean;

  public on<K extends keyof CustomClientEvents>(event: K, listener: (...args: CustomClientEvents[K]) => void): this;
  public on<S extends string | symbol>(event: Exclude<S, keyof CustomClientEvents>, listener: (...args: any[]) => void): this;
}
