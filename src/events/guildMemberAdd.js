const { stripIndents } = require("../utils");

exports.run = (bot, member) => {
  bot.channels.resolve(bot.config.welcomeChannel).send(
    stripIndents(`
        Wilkommen an Bord ${member}!`),
  );
  bot.users.cache.get(member.user.id).send(
    stripIndents(`
        Willkommen auf CONspiracy,
        
        ich freue mich dich hier begrüßen zu dürfen. 
        Die nächste CONspirancy findet vom 17.07-19.07.2020 statt.
        Wenn Du dich für Rollenspielrunden interessierst, findest du alle ausgeschriebenen Runden hier: 
        https://trello.com/b/DQW3k460/pegasus-spiele-conspiracy

        Wenn Du für Gespräche unter Gleichgesinnten hier bist, unterhalte dich gern mit uns im #small-talk Channel. 

        Ich wünsche dir viel Spaß, 
        
        Dein Pegabot`),
  );
};