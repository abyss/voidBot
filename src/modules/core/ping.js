const { send } = require('../../includes/helpers');

exports.run = async (msg) => {
    send(msg.channel, `:ping_pong:  **|  Pong!** (${Math.ceil(this.mod.bot.ping)}ms)`);

    return true;
};

exports.usage = new Map();

exports.config = {
    name: 'Ping',
    cmd: 'ping',
    alias: [],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Causes the bot to respond with \'Pong!\' and it\'s ping to the server',
    debug: false
};
