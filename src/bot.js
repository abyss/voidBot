const discordjs = require('discord.js');
const chalk = require('chalk');
const path = require('path');

const LoggingHandler = require('./handlers/logging-handler');
const ConfigHandler = require('./handlers/config-handler');
const CommandHandler = require('./handlers/command-handler');
const ModuleHandler = require('./handlers/module-handler');
const LowDBHandler = require('./handlers/lowdb-handler');

const bot = new discordjs.Client();
bot.loggingHandler = new LoggingHandler(bot);
bot.config = new ConfigHandler(bot);
bot.commandHandler = new CommandHandler(bot);
bot.moduleHandler = new ModuleHandler(bot);
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

    bot.commandHandler.init();
    bot.moduleHandler.init();

    bot.log('Bot loaded!');

    bot.generateInvite(bot.config.permissions).then((invite_link) => {
        bot.log(`Invite Link: ${chalk.blue.underline(invite_link)}`);
    });
});

bot.on('message', message => {
    // TODO: Module Message Handling
    if (message.author.bot) { return; }
    bot.commandHandler.onMessage(message);
});

process.on('unhandledRejection', err => {
    console.error(`unhandledRejection: \n${err.stack}`);
});

process.on('uncaughtException', (err) => {
    const errorMsg = (err.stack || err || '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
    console.error(`uncaughtException: \n${errorMsg}`);
});

bot.login(process.env.TOKEN).catch(console.error);
