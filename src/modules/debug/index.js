const Module = require('../../includes/module-class');

module.exports = class DebugModule extends Module {
    get config() {
        return {
            name: 'Debug',
            description: 'Debugging commands',
            debug: true // This makes it unusable to anyone besides process.env.OWNER
        };
    }
};
