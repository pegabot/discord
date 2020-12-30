/*
 * Copyright (c) 2020 - 2021 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();
const path = require("path");
const express = require("express");
const server = express();

server.get("/", (_, res) => {
  res.redirect(process.env.inviteUrl || "https://pegasus.de");
});

server.use(express.static(path.resolve(__dirname, "static")));

server.listen(process.env.PORT || 80, () => console.log("Webserver started!"));
