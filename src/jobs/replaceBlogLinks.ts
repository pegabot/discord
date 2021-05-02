/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import bent from "bent";
import { TextChannel } from "discord.js";
import { Job } from "../classes/job";
import { ReplaceBlogLinksModel } from "../models/replaceBlogLinks";

export class ReplaceBlogLinksJob extends Job {
  name = "Pegaus-Blog Links in Nachrichten austauschen";
  env = "blog";
  interval = 1000 * 60 * 60 * 5; // Milliseconds * Seconds * Minutes * Hours

  checkSite = bent();

  execute(): void {
    ReplaceBlogLinksModel.find({}, async (error, docs) => {
      if (error) throw error;
      if (docs.length < 1) return;

      for (const doc of docs) {
        try {
          const siteExists = this.checkSite(doc.seoURL);
          if (!siteExists) continue;

          const guild = await this.bot.client.guilds.fetch(this.bot.config.guildId);
          const channel = guild.channels.resolve(doc.channelID);
          if (!channel) return;

          const message = await (channel as TextChannel).messages.fetch(doc.messageID);
          const oldContent = message.content;
          message.edit(oldContent.replace(doc.rawURL, doc.seoURL));
          doc.delete();
        } catch (err) {
          console.error(err);
          throw err;
        }
      }
    });
  }
}
