/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { config } from "dotenv";
config();

import * as path from "path";
import express from "express";
const app = express();

app.get("/", (_: express.Request, res: express.Response) => {
  res.redirect(process.env.inviteUrl || "https://pegasus.de");
});

app.get("/ping", (_: express.Request, res: express.Response) => {
  res.send("Pong!");
});

app.get("/dice-rules", (_: express.Request, res: express.Response) => {
  res.redirect(
    "https://jaegers.net/tools-downloads-und-listen/tools/anleitung-zum-online-wuerfel-tool-rollbutler/anleitung-zum-online-wuerfel-tool-rollbutler-wuerfelvorschrift/",
  );
});

app.use(express.static(path.resolve(__dirname, "static")));

export const server = app;
