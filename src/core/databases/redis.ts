/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import redis from "redis";

export class RedisConnector {
  client: redis.RedisClient = redis.createClient({ url: process.env.REDIS_URL });
}
