const { send } = require('../../../utils/chat');

exports.run = async (msg) => {
    const roleList = [];

    msg.guild.roles.forEach(role => {
        roleList.push(`${role.id}: ${role.name}`);
    });

    const output = '```' + roleList.join('\n') + '```';

    await send(msg.channel, output);

    return true;
};

exports.usage = new Map();

exports.config = {
    name: 'List Roles',
    cmd: 'roles',
    alias: ['rolelist', 'listroles'],
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: ['MANAGE_ROLES'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'List all roles on the server with their ID',
    debug: true // If true: unusable to anyone besides process.env.OWNER
};
