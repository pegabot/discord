/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { HosttargetMessage } from "dank-twitch-irc";
import { Client, ClientEvents, MessageReaction, User } from "discord.js";

interface CustomClientEvents extends ClientEvents {
  handleReroll: [MessageReaction, User];
  handleCommandRepeat: [MessageReaction, User];
  handleTwitch: [HosttargetMessage?];
}

export class CustomClient extends Client {
  public emit<K extends keyof CustomClientEvents>(event: K, ...args: CustomClientEvents[K]): boolean;
  public emit<S extends string | symbol>(event: Exclude<S, keyof CustomClientEvents>, ...args: any[]): boolean;
}