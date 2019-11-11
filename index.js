const bot = require('./src/bot');

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

const gracefulExit = () => {
    bot.client.destroy();
    process.exit(0);
};

process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);

// bot.login = () => Promise.resolve();

bot.client.login(process.env.TOKEN).catch((err) => {
    console.error('Login Error', err);
});
