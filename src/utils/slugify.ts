/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import slugifyLib from "@sindresorhus/slugify";

export const slugify = (path: string): string => {
  return (
    path
      .split("/")
      .map((elt) => {
        return slugifyLib(elt, {
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
