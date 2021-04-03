/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

export const cloneClass = <T>(instance: any): T => {
  const copy = new (instance.constructor as { new (): T })();
  Object.assign(copy, instance);
  return copy;
};
