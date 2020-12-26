/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

exports.module = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+(-|–)\s+/g, "-")
    .replace(/\s/g, "-")
    .replace(/:/g, "-")
    .replace(/\(/g, "-")
    .replace(/\)/g, "")
    .replace(/!/g, "")
    .replace(/,/g, "")
    .replace(/´/g, "-")
    .replace(/ä/g, "ae")
    .replace(/ü/g, "ue")
    .replace(/ö/g, "oe")
    .replace(/ß/g, "ss")
    .replace(/&/g, "")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ō/g, "o")
    .replace(/„/g, "-")
    .replace(/“/g, "-")
    .replace(/#/g, "-")
    .replace(/'/g, "-")
    .replace(/-$/g, "")
    .replace(/-+/g, "-");
};
