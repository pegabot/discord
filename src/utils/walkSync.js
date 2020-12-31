/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const fs = require("fs");
const path = require("path");

const walkSync = (files, fileDir, fileList = []) => {
  for (const file of files) {
    const absolutePath = path.join(fileDir, file);
    if (fs.statSync(absolutePath).isDirectory()) {
      const dir = fs.readdirSync(absolutePath);
      walkSync(dir, absolutePath, fileList);
    } else {
      if (!absolutePath.includes(".js") || absolutePath.includes("#")) continue;
      fileList.push(path.relative(__dirname, absolutePath));
    }
  }
  return fileList;
};

exports.module = walkSync;
