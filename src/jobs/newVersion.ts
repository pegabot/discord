/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
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

    let release;
    try {
      release = await request(`GET /repos/pegabot/discord/releases/tags/${version}`);
    } catch (error) {
      return;
    }

    // @ts-ignore: this is intended
    this.bot.logger.admin_blue(`**Neue Version:** \n\n ${release.data.body || "keine Beschreibung verfügbar!"}`, release.data.html_url);

    entry.save();
  }
}
