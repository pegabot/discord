/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { createHash } from "crypto";

export const computeSHA256 = (lines: string): string => {
  const hash = createHash("sha256");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;
    hash.write(line);
  }

  return hash.digest("hex");
};
