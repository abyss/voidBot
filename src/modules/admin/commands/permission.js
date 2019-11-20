const bot = require('../../../bot');
const { send } = require('../../../utils/chat');
const { findRole } = require('../../../utils/discord');

exports.run = async (msg, args) => {
    if (!(args.length === 3)) {
        send(msg.channel, 'Unknown options');
        return false;
    }

    const allowedStates = {
        'allow': 'allow',
        'deny': 'deny',
        'default': 'default',
        'yes': 'allow',
        'no': 'deny',
        'maybe': 'default',
        'enable': 'allow',
        'disable': 'deny',
    };

    const command = bot.commands.lookup.getCommand(args[0]);

    if (!command) {
        send(msg.channel, 'Command not found');
        return false;
    }

    const role = findRole(msg.guild, args[1]);

    if (!role) {
        send(msg.channel, 'Role not found');
        return false;
    }

    const state = allowedStates[args[2]];

    if (!state) {
        send(msg.channel, 'State must be "allow", "deny", or "default"');
        return false;
    }

    bot.commands.permissions.setCommandPermission(
        msg.guild,
        command.id,
        role.id,
        state
    );

    send(msg.channel, ':ok_hand:');
    return true;
};

const usage = new Map();
usage.set('list', '**NOT IMPLEMENTED** list all permissions for the guild');
usage.set('<command>', '**NOT IMPLEMENTED** list permissions for a given command');
usage.set('<role>', '**NOT IMPLEMENTED** list permissions for a given role');
usage.set('<command> <role name> <allow | deny | default>', 'change permission for given command and role');
exports.usage = usage;

exports.config = {
    name: 'Permission Control',
    cmd: 'permission',
    alias: ['perm', 'permissions'],
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: ['MANAGE_GUILD'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Change permissions for commands',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
