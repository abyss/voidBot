const chalk = require('chalk');
const discordjs = require('discord.js');

const bot = new discordjs.Client();
module.exports = bot;

require('./startup');

bot.on('ready', () => {
    bot.log('Stats:');
    bot.log(`User: ${bot.user.tag} <ID: ${bot.user.id}>`);
    bot.log(`Users: ${bot.users.size}, Guilds: ${bot.guilds.size}`);

    bot.user.setPresence({ game: { name: `voidBot | @${bot.user.username} help` }, status: 'online' });
    bot.log('Bot loaded!');

    bot.generateInvite(bot.config.permissions).then((invite_link) => {
        bot.log(`Invite Link: ${chalk.cyan.underline(invite_link)}`);
    });
});

bot.on('message', message => {
    if (message.author.bot) { return; }
    bot.commands.processor.onMessage(message);
});

// TODO: Handle ErrorEvent ECONNRESET gracefully without log when not debug
bot.on('error', err => {
    const errorMsg = (err.stack || err.error || err || '').toString();
    bot.error(`discord.js Error: \n${errorMsg}`);
});
