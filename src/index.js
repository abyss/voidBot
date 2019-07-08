const bot = require('./bot');

function setTitle(title) {
    process.title = title;
    process.stdout.write(`\u001B]0;${title}\u0007`);
}

setTitle(`voidBot ${bot.config.version}`);

process.on('unhandledRejection', err => {
    const errorMsg = (err.stack || err || '').toString();
    console.error(`unhandledRejection: \n${errorMsg}`);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    const errorMsg = (err.stack || err || '').toString();
    console.error(`uncaughtException: \n${errorMsg}`);
    process.exit(1);
});

bot.login(process.env.TOKEN).catch(console.error);
