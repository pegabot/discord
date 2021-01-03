/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { createHash } = require("crypto");

exports.module = {
  computeSHA256: (lines) => {
    const hash = createHash("sha256");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === "") continue;
      hash.write(line);
    }

    return hash.digest("hex");
  },
};
