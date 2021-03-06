/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import * as fs from "fs";
import * as path from "path";

export const walkSync = (files: string[], fileDir: string, fileList: string[] = []): string[] => {
  for (const file of files) {
    const absolutePath = path.join(fileDir, file);
    if (fs.statSync(absolutePath).isDirectory()) {
      const dir = fs.readdirSync(absolutePath);
      walkSync(dir, absolutePath, fileList);
    } else {
      if (!absolutePath.includes(".js") || absolutePath.includes("#")) continue;
      fileList.push(absolutePath);
    }
  }
  return fileList;
};
