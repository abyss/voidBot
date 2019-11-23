const chalk = require('chalk');
const discordjs = require('discord.js');

const bot = {};
module.exports = bot;
const client = new discordjs.Client();
bot.client = client;

require('./startup');

const { asyncForEach } = require('./utils/general');
const { serverStats } = require('./utils/discord');

function allServerStats() {
    asyncForEach(client.guilds.array(), async (guild) => {
        await serverStats(guild);
    });
}

client.on('ready', () => {
    bot.log('Stats:');
    bot.log(`User: ${client.user.tag} <ID: ${client.user.id}>`);
    bot.log(`Users: ${client.users.size}, Guilds: ${client.guilds.size}`);

    client.user.setPresence({ game: { name: `voidBot | @${client.user.username} help` }, status: 'online' });
    bot.log('Bot loaded!');

    client.generateInvite(bot.config.permissions).then((invite_link) => {
        bot.log(`Invite Link: ${chalk.cyan.underline(invite_link)}`);
    });

    allServerStats();
    client.setInterval(allServerStats, 1000 * 60 * 30); // Every 30 Mins
});

client.on('message', message => {
    if (message.author.bot) { return; }
    bot.commands.processor(message);
});

client.on('guildCreate', guild => {
    serverStats(guild);
    bot.log(`Joined new guild: ${guild.name} (${guild.id})`);
    bot.log(`Users: ${client.users.size}, Guilds: ${client.guilds.size}`);
});

// TODO: Handle ErrorEvent ECONNRESET gracefully without log when not debug
client.on('error', err => {
    const errorMsg = (err.stack || err.error || err || '').toString();
    bot.error(`discord.js Error: \n${errorMsg}`);
});
