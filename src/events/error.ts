/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import bot from "../bot";
import { Event } from "../core/events/event";
import { isProduction } from "../utils/environment";

export default new Event("error", (error) => {
  if (!isProduction()) console.log(error);

  bot.logger.admin_error(error, ":x: ein Fehler ist aufgetreten");
});
