/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const fetch = require('node-fetch');
const { MessageAttachment } = require('discord.js');

exports.run = async (bot, msg, args) => {
  fetch(`https://dog.ceo/api/breeds/image/random`)
    .then((response) => response.json())
    .then((json) =>
      fetch(json.message)
        .then((response) => response.buffer())
        .then((buffer) => {
          msg.channel.send('', new MessageAttachment(buffer));
        }),
    );
};

exports.info = {
  name: 'wuff',
  usage: ['wuff'],
  help: 'Liefert ein zufälliges Hundebild zurück.',
};
