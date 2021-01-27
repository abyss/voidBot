const chalk = require('chalk');
const discordjs = require('discord.js');

const bot = {};
module.exports = bot;
const client = new discordjs.Client({ ws:  { intents: discordjs.Intents.ALL }});
bot.client = client;

require('./startup');

const { serverStats, allServerUpkeep } = require('./utils/discord');

client.on('ready', () => {
    bot.log('Stats:');
    bot.log(`User: ${client.user.tag} <ID: ${client.user.id}>`);
    bot.log(`Users: ${client.users.cache.size}, Guilds: ${client.guilds.cache.size}`);

    client.user.setPresence({ activity: { name: `voidBot | @${client.user.username} help` }, status: 'online' });
    bot.log('Bot loaded!');

    client.generateInvite({
        permissions: bot.config.permissions
    }).then((invite_link) => {
        bot.log(`Invite Link: ${chalk.cyan.underline(invite_link)}`);
    });

    allServerUpkeep();
    client.setInterval(allServerUpkeep, 1000 * 60 * 30); // Every 30 Mins
});

client.on('message', message => {
    if (message.author.bot) { return; }
    bot.commands.processor(message);
});

client.on('guildCreate', guild => {
    serverStats(guild);
    bot.log(`Joined new guild: ${guild.name} (${guild.id})`);
    bot.log(`Users: ${client.users.cache.size}, Guilds: ${client.guilds.cache.size}`);
});

client.on('error', err => {
    bot.error('discord.js Error:');
    bot.error(err);
});
