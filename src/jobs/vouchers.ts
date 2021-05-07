/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Job } from "../core/jobs/job";
import { SessionModel, VoucherModel } from "../models/quiz";
import { stripIndents } from "../utils/stripIndents";

export class VoucherJob extends Job {
  name = "Versende Vouchers";
  env = "voucher";
  interval = 20000;

  execute(): void {
    SessionModel.find({ status: "closed", won: true, shipped: false }, (error, sessions) => {
      if (sessions.length === 0) return;

      VoucherModel.find({ used: false }, (error, vouchers) => {
        if (vouchers.length === 0) return;

        for (const [index, session] of sessions.entries()) {
          const voucher = vouchers[index];

          try {
            const user = this.bot.client.users?.cache?.get(session.userId || "");
            if (!user) continue;
            user.send(
              stripIndents(`
            Dein Gutscheincode lautet ***${voucher.code}***. Du kannst ihn ab sofort und bis spätestens 31.03.2021 auf www.pegasusshop.de einlösen, um dir dein Exemplar der nagelneuen Splittermond Einstiegsbox „Aufbruch ins Abenteuer“ mit 30% Rabatt zu sichern. 
            
            Falls du regelmäßige Updates zu Aktionen wie dieser, aber auch zu Events und Angeboten erhalten möchtest, dann abonniere jetzt unseren Newsletter auf www.pegasus.de/newsletter. In deinem Pegasus Digital-Konto kannst du dich außerdem für unseren Rollenspiel-Newsletter anmelden. Und wer weiß, vielleicht lässt sich auf www.pegasusdigital.de auch schon Wissen für unser nächstes Geek Quiz sammeln! 
            
            Dein Pegabot :robot:
            `),
            );

            voucher.used = true;
            voucher._session = session._id;
            voucher.save();

            session.voucher = voucher;
            session.shipped = true;
            session.save();
          } catch (e) {
            continue;
          }
        }
      });
    });
  }
}
