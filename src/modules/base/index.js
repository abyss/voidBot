const Module = require('../module-class');

module.exports = class BaseModule extends Module {
    get config() {
        return {
            name: 'Base',
            description: 'Base Module',
            debug: false // This makes it unusable to anyone besides process.env.OWNER
        };
    }
};
