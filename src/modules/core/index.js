const Module = require('../../includes/module-class');

module.exports = class CoreModule extends Module {
    get config() {
        return {
            name: 'Core',
            description: 'Core functionality',
            debug: false // This makes it unusable to anyone besides process.env.OWNER
        };
    }

    async hasPermission(guild, member, command) {
        return this.bot.handlers.permissions.hasPermission(guild, member, command);
    }
};
