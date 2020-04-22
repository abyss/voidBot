const { send } = require('../../../utils/chat');
const { findMember } = require('../../../utils/discord');

exports.run = async (msg, args) => {
    const result = findMember(msg.guild, args.join(' '));
    let output = '';
    if (!result) {
        output = 'Nothing found.';
    } else {
        output = `Found: \`${result.displayName}\``;
    }

    await send(msg.channel, output);

    return true;
};

exports.usage = new Map();

exports.config = {
    name: 'Find Member',
    cmd: 'findmember',
    alias: ['finduser'],
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Find a member of the server by name or ID',
    debug: true // If true: unusable to anyone besides process.env.OWNER
};
