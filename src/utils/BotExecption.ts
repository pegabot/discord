/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

export class BotExecption {
  name: string;
  message: string;
  constructor(message: string) {
    this.name = "BotExecption";
    this.message = message;
  }
}
