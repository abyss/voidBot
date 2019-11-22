const { send } = require('../../../utils/chat');
const { findRole } = require('../../../utils/discord');

exports.run = async (msg, args) => {
    const result = findRole(msg.guild, args.join(' '));
    let output = '';
    if (!result) {
        output = 'Nothing found.';
    } else {
        output = `Found: \`${result.name}\``;
    }

    await send(msg.channel, output);

    return true;
};

exports.usage = new Map();

exports.config = {
    name: 'Find Role',
    cmd: 'findrole',
    alias: [],
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Find a role by name or ID',
    debug: true // If true: unusable to anyone besides process.env.OWNER
};
