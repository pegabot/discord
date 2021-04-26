/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

export const cloneClass = <T>(instance: any): T => {
  const copy = new (instance.constructor as { new (): T })();
  Object.assign(copy, instance);
  return copy;
};
