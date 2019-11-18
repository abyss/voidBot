const { client } = require('../../../bot');
const { send } = require('../../../utils/chat');
const moment = require('moment');
require('moment-duration-format');

exports.run = async (msg) => {
    const formattedUptime = moment
        .duration(client.uptime)
        .format('d [days], h [hours], m [minutes], [and] s [seconds]');

    send(msg.channel, `I have been connected to discord for ${formattedUptime}`);

    return true;
};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map();

exports.config = {
    name: 'Bot Uptime',
    cmd: 'uptime',
    alias: [],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Responds with the bot\'s time connected to the discord server',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
