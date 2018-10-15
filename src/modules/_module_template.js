const Module = require('../../includes/module-class');

// Make sure you change the name here
module.exports = class ModuleNameModule extends Module {
    // Module commands go here

    get config() {
        return {
            name: 'Name of the Module',
            description: 'Description of the Module',
            debug: true // This makes it unusable to anyone besides process.env.OWNER
        };
    }
};
