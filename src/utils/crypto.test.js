/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const {
  module: { computeSHA256 },
} = require("./crypto");

const input = "o9LDhp0Qd11XVPLaRhVB";
const expected_hash = "04367d84ac10b41a7999c0f6ceb60ee4d9431fcac3217c4cad5df1759b4cae55";

it("Testing the computeSHA256 function", () => {
  expect(computeSHA256(input)).toBe(expected_hash);
});
