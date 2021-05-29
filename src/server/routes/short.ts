/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import express from "express";
import { StatusCodes } from "http-status-codes";
import bot from "../../bot";
import { generateShortUrlKey } from "../../utils/redis";

export const shortenerRouter = express();

shortenerRouter.get("/:id", (req, res) => {
  const id = req.params.id;

  bot.redis.client.get(generateShortUrlKey(id) as string, (error, value) => {
    if (error) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);

    if (!value) {
      return res.redirect("https://pegabot.pegasus.de");
    }

    return res.redirect(value);
  });
});
