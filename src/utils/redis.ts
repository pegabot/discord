/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, PartialMessage } from "discord.js";

export const generateMessageDeletedKey = (message: Message | PartialMessage) => `deleted-${message.id}`;
export const generateLogKey = (id: string) => `log-${id}`;
export const generateErrorLogKey = (id: string) => `logmessage-${id}`;
export const generateShortUrlKey = (id: string) => `short-${id}`;
