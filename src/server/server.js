/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

require("dotenv").config();
const path = require("path");
const express = require("express");
const server = express();

server.get("/", (_, res) => {
  res.redirect(process.env.inviteUrl || "https://pegasus.de");
});

server.get("/ping", (_, res) => {
  res.send("Pong!");
});

server.get("/dice-rules", (_, res) => {
  res.redirect(
    "https://jaegers.net/tools-downloads-und-listen/tools/anleitung-zum-online-wuerfel-tool-rollbutler/anleitung-zum-online-wuerfel-tool-rollbutler-wuerfelvorschrift/",
  );
});

server.use(express.static(path.resolve(__dirname, "static")));

server.listen(process.env.PORT || 80, () => console.log(`💻 Webserver started!`));

exports.server = server;
