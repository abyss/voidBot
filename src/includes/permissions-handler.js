const _ = require('lodash');

class PermissionsHandler {
    constructor(bot) {
        this.bot = bot;
    }

    async hasCommandPermissions(guild, member, command) {
        let position = -1;
        let state = '';

        for (const roleCollection of member.roles) {
            let role = roleCollection[1]; // roleCollection is a Collection with 2 values, ID and Object
            // highest position gets priority, in all non-undefined cases
            if (role.calculatedPosition > position) {
                // have to pass command.id in brackets because of periods
                let newState = await this.bot.db.get(guild.id, `permissions['${command.id}'].groups.${role.id}`);
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

        if (commandDefaultPermissions.includes('NOONE') || commandDefaultPermissions.includes('')) {
            return false;
        }

        return member.hasPermission(commandDefaultPermissions);
    }

    setCommandPermission(guild, cmdId, roleId, state = 'default') {
        // state can be 'allow' 'deny' or 'default'
        if (state === 'allow' || state === 'deny') {
            this.bot.db.set(guild, `permissions['${cmdId}'].groups.${roleId}`, state);
        } else {
            this.bot.db.delete(guild, `permissions['${cmdId}'].groups.${roleId}`);
        }
    }
}

module.exports = PermissionsHandler;
