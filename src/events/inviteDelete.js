/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");

exports.run = async (bot, invite) => {
  bot.logger.admin(new MessageEmbed().setAuthor(bot.user.username).setDescription(`:outbox_tray: Die Einladung: ${invite.url} **wurde gelöscht**.`).setFooter(`Code: ${invite.code}`).setTimestamp(new Date()).setColor("#ee1111"));
};
