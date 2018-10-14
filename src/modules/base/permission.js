const { send } = require('../../includes/helpers');

exports.run = async (msg, args) => {
    if (!(args.length === 3)) { throw 'Have to pass three arguments'; }

    let allowedStates = {
        'allow': 'allow',
        'deny': 'deny',
        'default': 'default',
        'yes': 'allow',
        'no': 'deny',
        'maybe': 'default',
    };

    let command = args[0];
    let role = args[1];
    let state = allowedStates[args[2]];

    if (!state) {
        throw 'State must be "allow", "deny", or "default"';
    }

    this.mod.changePermissions(msg.guild, command, role, state);

    send(msg.channel, ':ok_hand:');
};

exports.config = {
    name: 'Permission',
    cmd: 'permission',
    alias: ['perm'],
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: ['ADMINISTRATOR'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Change permission for commands',
    debug: true // If true: unusable to anyone besides process.env.OWNER
};
