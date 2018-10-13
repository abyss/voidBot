const send = require('../../includes/helpers').send;

exports.run = async (msg) => {
    await send(msg.channel, ':ping_pong:  **|  Pong!**');
};

exports.config = {
    name: 'Ping',
    cmd: 'ping',
    alias: ['p'],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Causes the bot to respond with \'Pong!\'',
    debug: false
};
