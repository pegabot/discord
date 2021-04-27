/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Octokit } from "@octokit/core";
import { Job } from "../classes/job";
import { VersionModel } from "../models/version";
import { version } from "../utils/version";
const { request } = new Octokit({});

export class NewVersionJob extends Job {
  name = "Info bei neuer Version";

  async setup(): Promise<void> {
    // @ts-ignore: this is intended
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

    const release = await request(`GET /repos/pegabot/discord/releases/tags/${version}`);

    // @ts-ignore: this is intended
    this.bot.logger.admin_blue(`**Neue Version:** \n\n ${release.data.body || "keine Beschreibung verfügbar!"}`, release.data.html_url);

    entry.save();
  }
}
