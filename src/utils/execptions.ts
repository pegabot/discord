/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

export class BotExecption {
  name: string;
  message: string;
  constructor(message: string) {
    this.name = "BotExecption";
    this.message = message;
  }
}