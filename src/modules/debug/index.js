const Module = require('../../includes/module-class');

module.exports = class DebugModule extends Module {
    get config() {
        return {
            name: 'Debug',
            description: 'Debug Module',
            debug: true // This makes it unusable to anyone besides process.env.OWNER
        };
    }

    async dbTestSet(guild, data) {
        try {
            await this.bot.db.set(guild, 'debug.test', data);
        } catch (error) {
            this.bot.error(error);
            throw error;
        }
    }

    async dbTestGet(guild) {
        try {
            const data = await this.bot.db.get(guild, 'debug.test');
            return data;
        } catch (error) {
            this.bot.error(error);
            throw error;
        }
    }
};
