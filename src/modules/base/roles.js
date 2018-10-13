const send = require('../../includes/helpers').send;

exports.run = async (msg) => {
    const roleList = [];

    msg.guild.roles.tap(role => {
        roleList.push(`${role.id}: ${role.name}`);
    });

    const output = '```' + roleList.join('\n') + '```';

    await send(msg.channel, output);
};

exports.config = {
    name: 'List Roles',
    cmd: 'roles',
    alias: ['rolelist', 'listroles'],
    // Permissions use https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS
    // or NOONE - which rejects everyone.
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: ['MANAGE_ROLES'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be triggered
    description: 'List all roles on the server with their ID',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
