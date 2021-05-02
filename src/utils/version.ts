/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

export const isSemanticVersion = (version: string): boolean => {
  if (version.match(/([0-9]+)\.([0-9]+)\.([0-9]+)/)) return true;
  return false;
};

export const versionGitHubLink = (version: string): string => {
  if (isSemanticVersion(version)) return `https://github.com/pegabot/discord/releases/tag/${version}`;
  return `https://github.com/pegabot/discord/commit/${version}`;
};
