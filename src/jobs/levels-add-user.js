/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.execute = (bot) => {
  const LevelsModel = bot.db.model("levels");

  LevelsModel.find({ user: { $exists: false } }, (error, entries) => {
    if (error) return;
    entries.forEach(async (entry) => {
      const user = await bot.users.fetch(entry.userID);
      entry.user = JSON.parse(JSON.stringify(user));
      entry.save();
    });
  });
};

exports.info = {
  name: `Adding users to levels documents`,
  interval: 60000,
};
