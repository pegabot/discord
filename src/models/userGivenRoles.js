/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { Schema } = require("mongoose");

const userGivenRoles = new Schema({
  expires: { type: Number },
  userId: String,
  roleId: String,
});

exports.schema = userGivenRoles;
