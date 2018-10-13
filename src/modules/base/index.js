const Module = require('../../includes/module-class');
const findRole = require('../../includes/helpers').findRole;

module.exports = class BaseModule extends Module {
    get config() {
        return {
            name: 'Base',
            description: 'Base Module',
            debug: false // This makes it unusable to anyone besides process.env.OWNER
        };
    }

    async changePermissions(guild, cmdText, roleText, state) {
        let command = this.bot.commandHandler.getCommand(cmdText);

        if (!guild.available) {
            this.bot.error(`Guild: ${guild} not available.`);
            throw 'Guild not available. Please try again later';
        }

        if (!command) {
            throw `No command ${cmdText} found.`;
        }

        if (!(state === 'allow' || state === 'deny' || state === 'default')) {
            throw `Invalid state: ${state}`;
        }

        let role = findRole(guild, roleText);

        if (!role) {
            throw `Role ${roleText} not found.`;
        }

        this.bot.commandHandler.permissions.setCommandPermission(guild.id, command.id, role.id, state);
    }
};
