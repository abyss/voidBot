const bot = require('../bot');

const checkDebug = (author, command) => {
    const debug = command.config.debug || command.mod.config.debug;
    if (debug && !bot.config.isOwner(author)) return false;
    return true;
};

const hasPermission = async (guild, member, command) => {
    let position = -1;
    let state = '';

    for (const [id, role] of member.roles) {
        // highest position gets priority, in all non-undefined cases
        if (role.calculatedPosition > position) {
            // have to pass command.id in brackets because of periods
            let newState = await bot.db.get(guild.id, `permissions['${command.id}'].groups.${id}`);
            if (newState) {
                position = role.calculatedPosition;
                state = newState;
            }
        }
    }

    if (state === 'allow') return true;
    if (state === 'deny') return false;

    // None of the above? Fall back to Default
    const commandDefaultPermissions = command.config.defaultPermissions;

    if (commandDefaultPermissions.includes('NOONE')) {
        return false;
    }

    return member.hasPermission(commandDefaultPermissions);
};

const setCommandPermission = (guildId, cmdId, roleId, state = 'default') => {
    // state can be 'allow' 'deny' or 'default'
    if (state === 'allow' || state === 'deny') {
        return bot.db.set(guildId, `permissions['${cmdId}'].groups.${roleId}`, state);
    } else {
        return bot.db.delete(guildId, `permissions['${cmdId}'].groups.${roleId}`);
    }
};

module.exports = {
    checkDebug,
    hasPermission,
    setCommandPermission
};
