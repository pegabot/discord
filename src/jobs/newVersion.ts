/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { version } from "../constants/version";
import { Job } from "../core/jobs/job";
import { VersionModel } from "../models/version";
import { versionGitHubLink } from "../utils/version";

export class NewVersionJob extends Job {
  name = "Info bei neuer Version";

  async setup(): Promise<void> {
    if (version === "x.y.z") return;

    const entries = await VersionModel.find({});

    let entry;
    if (entries.length > 0) {
      if (entries[0].version === version) return;
      entry = entries[0];
      entry.version = version;
    } else {
      entry = new VersionModel({ version: version });
    }

    this.bot.logger.admin(`Es läuft eine neue Version: \`${version}\`  🎉 \n (${versionGitHubLink(version)})`);

    entry.save();
  }
}
