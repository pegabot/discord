/**
 * Make any changes you need to make to the database here
 */
const path = require("path");
const { bot } = require("../../src/bot");
const backup = require("discord-backup");

// (async () => {
//   await new Promise(async (resolve, _) => {
//     setTimeout(async () => {
//       const guild = bot.guilds.cache.get(bot.config.guildId);
//       backup.setStorageFolder(path.resolve(__dirname, "../../backups/"));
//       await backup.create(guild); // Backup created in ./backups/
//       resolve(true);
//     }, 6000);
//   });
// })();

// (async () => {
//   await new Promise(async (resolve, _) => {
//     setTimeout(async () => {
//       const guild = bot.guilds.cache.get(bot.config.guildId);
//       backup.setStorageFolder(path.resolve(__dirname, "../../backups/"));
//       backup.load("826756857493323776", guild).then(() => {
//         backup.remove("826756857493323776"); // When the backup is loaded, it's recommended to delete it
//       });
//       resolve(true);
//     }, 6000);
//   });
// })();
