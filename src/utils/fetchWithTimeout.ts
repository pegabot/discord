/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import fetch from "node-fetch";

export const fetchWithTimeout = (url: string, options: any = {}, timeout: number = 4000): Promise<unknown> => {
  return Promise.race([fetch(url, options), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeout))]);
};
