/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    DB_STRING: string;
    apiToken: string;
    prefix: string;
    ownerIds: string;
    guildId: string;
    inviteUrl: string;
    engineerRole: string;
    playerSearchRole: string;
    adminChannel: string;
    errorChannel: string;
    welcomeChannel: string;
    goodbyeChannel: string;
    ignoredChannels: string;
    ignoredCategories: string;
    TENOR_API_KEY: string;
    enable_twitter: string;
    TWITTER_CHANNEL: string;
    TWITTER_CONSUMER_KEY: string;
    TWITTER_CONSUMER_SECRET: string;
    TWITTER_TOKEN: string;
    TWITTER_TOKEN_SECRET: string;
    YOUTUBE_CHANNEL: string;
    YOUTUBE_KEY: string;
    YOUTUBE_CHANNELS: string;
    enable_voucher: string;
    enable_sessionreset: string;
    enable_blog: string;
    BLOG_CHANNEL_DE: string;
    BLOG_CHANNEL_EN: string;
    enable_trello: string;
    TRELLO_KEY: string;
    TRELLO_TOKEN: string;
    TRELLO_INFO_CHANNEL: string;
    TWITCH_INFO_CHANNEL: string;
    ROLLBUTLER_KEY: string;
    ROLLBUTLER_PASS: string;
    PEGASUSSHOP_API_USER: string;
    PEGASUSSHOP_API_KEY: string;
  }
}
