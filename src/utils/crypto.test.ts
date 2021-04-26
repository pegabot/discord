/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { computeSHA256 } from "./crypto";

const input = "o9LDhp0Qd11XVPLaRhVB";
const expected_hash = "04367d84ac10b41a7999c0f6ceb60ee4d9431fcac3217c4cad5df1759b4cae55";

it("Testing the computeSHA256 function", () => {
  expect(computeSHA256(input)).toBe(expected_hash);
});
