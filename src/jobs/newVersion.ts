/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import bot from "../bot";
import { version } from "../constants/version";
import { Job } from "../core/jobs/job";
import { versionGitHubLink } from "../utils/version";

export class NewVersionJob extends Job {
  name = "Info bei neuer Version";

  async setup(): Promise<void> {
    if (version === "x.y.z") return;

    bot.redis.client.get("version", (error, value) => {
      if (error) throw error;
      if (value === version) return;

      bot.redis.client.set("version", version);
      this.bot.logger.admin(`Es läuft eine neue Version: \`${version}\`  🎉 \n (${versionGitHubLink(version)})`);
    });
  }
}
