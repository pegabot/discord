/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

export interface BaseExecption extends Error {
  name: string;
  message: string;
  ignore?: boolean;
}

export class CommandExecption implements BaseExecption {
  name = "CommandExecption";
  constructor(public message: string) {}
}

export class TaskExecption implements BaseExecption {
  name = "TaskExecption";
  constructor(public message: string, public ignore: boolean = false) {}
}
