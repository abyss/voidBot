exports.run = async (msg) => {
    msg.channel.send(':ping_pong:  **|  Pong!**').catch(error => {
        this.mod.bot.error(`There was an error posting ping: ${error}`);
    });
};

exports.config = {
    name: 'Ping',
    cmd: 'ping',
    alias: ['p'],
    permissions: [],
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Causes the bot to respond with \'Pong!\'',
    debug: false
};
