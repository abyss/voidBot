const { send } = require('../../../utils/chat');
const { client } = require('../../../bot');

exports.run = async (msg) => {
    send(msg.channel, `:ping_pong:  **|  Pong!** (${Math.ceil(client.ws.ping)}ms)`);

    return true;
};

exports.usage = new Map();

exports.config = {
    name: 'Ping',
    cmd: 'ping',
    alias: ['p'],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Responds with the bot\'s latency to the server',
    debug: false
};
