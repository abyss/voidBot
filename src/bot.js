const discordjs = require('discord.js');
const chalk = require('chalk');
const path = require('path');

const LoggingHandler = require('./includes/logging-handler');
const ConfigHandler = require('./includes/config-handler');
const CommandHandler = require('./includes/command-handler');
const ModuleHandler = require('./includes/module-handler');
const LowDBHandler = require('./includes/lowdb-handler');

const bot = new discordjs.Client();
bot.logHandler = new LoggingHandler(bot);
bot.config = new ConfigHandler(bot);
bot.cmdHandler = new CommandHandler(bot);
bot.modHandler = new ModuleHandler(bot);
bot.db = new LowDBHandler(bot, path.resolve(__dirname, '../data'));

//TODO: Proper Error Handler for the bot

function setTitle(title) {
    process.title = title;
    process.stdout.write(`\u001B]0;${title}\u0007`);
}

setTitle(`voidBot ${bot.config.version}`);

bot.on('ready', () => {
    bot.log('Stats:');
    bot.log(`User: ${bot.user.tag} <ID: ${bot.user.id}>`);
    bot.log(`Users: ${bot.users.size}`);
    bot.log(`Channels: ${bot.channels.size}`);
    bot.log(`Guilds: ${bot.guilds.size}`);

    bot.cmdHandler.init();
    bot.modHandler.init();

    bot.user.setPresence({ game: { name: 'voidBot | use %help' }, status: 'online' });
    bot.log('Bot loaded!');

    bot.generateInvite(bot.config.permissions).then((invite_link) => {
        bot.log(`Invite Link: ${chalk.blue.underline(invite_link)}`);
    });
});

bot.on('message', message => {
    if (message.author.bot) { return; }
    bot.cmdHandler.onMessage(message);
});

// TODO: Handle ErrorEvent ECONNRESET gracefully without log when not debug
bot.on('error', err => {
    const errorMsg = (err.stack || err.error || err || '').toString();
    console.error(`unhandledRejection: \n${errorMsg}`);
});

process.on('unhandledRejection', err => {
    const errorMsg = (err.stack || err || '').toString();
    console.error(`unhandledRejection: \n${errorMsg}`);
});

process.on('uncaughtException', (err) => {
    const errorMsg = (err.stack || err || '').toString();
    console.error(`uncaughtException: \n${errorMsg}`);
});

bot.login(process.env.TOKEN).catch(console.error);
