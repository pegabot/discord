/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();
const express = require("express");
const server = express();

server.get("/", (_, res) => {
  res.redirect(process.env.inviteUrl || "https://pegasus.de");
});

server.listen(process.env.PORT || 80, () => console.log("Webserver started!"));
