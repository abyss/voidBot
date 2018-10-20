const { send } = require('../../includes/helpers');

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

    // TODO: verify command before passing to basemod?
    let command = args[0];
    let role = args[1];
    let state = allowedStates[args[2]];

    if (!state) {
        send(msg.channel, 'State must be "allow", "deny", or "default"');
        return false;
    }

    this.mod.changePermissions(msg.guild, command, role, state);

    send(msg.channel, ':ok_hand:');

    return true;
};

exports.usage = new Map([
    ['list', '**NOT IMPLEMENTED** list all permissions for the guild'],
    ['<command>', '**NOT IMPLEMENTED** list permissions for a given command'],
    ['<role>', '**NOT IMPLEMENTED** list permissions for a given role'],
    ['<command> <role name> <allow | deny | default>', 'change permission for given command and role'],
]);

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
