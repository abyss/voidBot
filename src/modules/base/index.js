const Module = require('../module-class');

class BaseModule extends Module {
    get config() {
        return {
            name: 'Base',
            description: 'Base Module',
            debug: false // This makes it unusable to anyone besides process.env.OWNER
        };
    }
}

module.exports = BaseModule;
