const { MessageEmbed } = require("discord.js");
const formatDistanceToNow = require("date-fns/formatDistanceToNow");
const { de } = require("date-fns/locale");

const { resolveUser, BotExecption } = require("../../utils");

exports.run = (bot, msg, args) => {
  let member = resolveUser(msg, args.join(" "));
  if (args.length === 0) ({ member } = msg);
  if (!member) throw new BotExecption("Dieser Benutzer wurde nicht gefunden.");

  const status = {
    online: `Benutzer ist online!`,
    idle: `Benutzer macht Pause, wahrscheinlich drinkt er gerade eine Tasse Tee`,
    offline: `Benutzer ist offline, wahrscheinlich am schlafen`,
    dnd: `Dieser Benutzer möchte gerade nicht gestört werden`,
  };
  const game = member.presence.game ? member.presence.game.name : "Spielt gerade kein Spiel";
  const createdAt = formatDistanceToNow(member.user.createdAt, {
    addSuffix: true,
    locale: de,
  });
  const joinedAt = formatDistanceToNow(member.joinedAt, { addSuffix: true });
  let roles = "Dieser Benutzer verfügt über keine speziellen Rollen";
  let size = 0;
  if (member.roles.cache.size !== 1) {
    // We don't use the @everyone role
    roles = member.roles.cache.filter((role) => role.name !== "@everyone");
    ({ size } = roles);
    if (roles.size !== 1) {
      roles = `${roles
        .array()
        .slice(0, -1)
        .map((r) => r.name)
        .join(", ")} und ${roles.last().name}`;
    } else {
      roles = roles.first().name;
    }
  }

  const embed = new MessageEmbed()
    .setAuthor(member.user.tag, member.user.displayAvatarURL())
    .setThumbnail(member.user.displayAvatarURL())
    .setTitle(`Informationen über ${member.displayName}`)
    .setDescription(status[member.presence.status])
    .addField("Benutzername", member.user.username, true)
    .addField(`Spielt...`, game, true)
    .addField("Account erstellt", createdAt, true)
    .addField("Dem Server beigetreten", joinedAt, true)
    .addField("ID", member.id, true)
    .addField("Bot", member.user.bot ? "Bleep bloop, ich bin ein Bot!" : "Dieser Benutzer ist kein Bot!", true)
    .addField(`Rollen [${size}]`, `\`${roles}\``);
  msg.channel.send(embed);
};

exports.info = {
  name: "userinfo",
  usage: ["userinfo", "userinfo <user>"],
  help: "Gibt informationen zu einem Benutzer wieder.",
};
