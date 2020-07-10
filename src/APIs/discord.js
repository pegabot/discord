/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();

const Discord = require("discord.js");

module.exports = new Discord.WebhookClient(process.env.DISCORD_ID, process.env.DISCORD_TOKEN);
