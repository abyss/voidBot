const bot = require('../../../bot');
const { send } = require('../../../utils/chat');
const { findRole } = require('../../../utils/discord');
const { stripIndentsExtra } = require('../../../utils/general');
const { hasPermission, setPermission } = require('../../../modular-commands/permissions');

exports.run = async (msg, args) => {
    if (args.length !== 3) {
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
        await send(msg.channel, 'Command not found');
        return false;
    }

    const role = findRole(msg.guild, args[1]);

    if (!role) {
        await send(msg.channel, 'Role not found');
        return false;
    }

    const state = allowedStates[args[2]];

    if (!state) {
        await send(msg.channel, 'State must be "allow", "deny", or "default"');
        return false;
    }

    if (msg.member.roles.highest.calculatedPosition < role.calculatedPosition) {
        await send(msg.channel, 'You cannot modify the permissions of a role higher than you');
        return true;
    }


    const prevState = await setPermission(msg.guild, command, role, state);

    // if command is preventLockout, do the check and rollback if it's been locked out.
    if (command.config.preventLockout) {

        const newPerm = await hasPermission(msg.guild, msg.member, command);
        if (!newPerm) {
            await setPermission(msg.guild, command, role, prevState);

            await send(msg.channel, stripIndentsExtra`
                You cannot deny permissions to that role because you would \
                deny it to yourself.
            `);

            return true;
        }
    }

    await send(msg.channel, ':ok_hand:');
    return true;
};

const usage = new Map();
usage.set('<command> <role name> <allow | deny | default>', 'change permission for given command and role');
exports.usage = usage;

exports.config = {
    name: 'Set Permissions',
    cmd: 'setpermissions',
    alias: ['setperm', 'setperms', 'setpermission'],
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: ['MANAGE_GUILD'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: '',
    preventLockout: true, // Prevent a user from removing their own permission to this command
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
