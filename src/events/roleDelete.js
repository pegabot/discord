/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");

exports.run = async (bot, role) => {
  bot.logger.admin(new MessageEmbed().setDescription(`:inbox_tray: Die Rolle: ${role} **wurde gelöscht**.`).setFooter(`ID: ${role.id}`).setTimestamp(role.createdAt).setColor("#ee1111"));
};
