/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const slugify = require("@sindresorhus/slugify");

exports.module = (path) => {
  return (
    path
      .split("/")
      .map((elt) => {
        return slugify(elt, {
          lowercase: false,
          decamelize: false,
          customReplacements: [
            ["&", "-"],
            // This needs to be replaced when an update is made to slugify by sindresorhus
            // https://github.com/sindresorhus/slugify/issues/55
            [".", "replacereplacereplacereplacereplacereplacereplacereplace"],
            ["Ä", "AE"],
            ["Ö", "OE"],
            ["Ü", "UE"],
            ["å", "aa"],
            ["ø", "oe"],
            ["ї", "ji"],
          ],
        });
      })
      .join("/")
      // This needs to be replaced when an update is made to slugify by sindresorhus
      // https://github.com/sindresorhus/slugify/issues/55
      .replace(/replacereplacereplacereplacereplacereplacereplacereplace/g, ".")
      .replace(/-\./g, ".")
  );
};
