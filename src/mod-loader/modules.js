const path = require('path');
const Module = require('./module-class');
const fs = require('fs');
const bot = require('../bot');

const modules = [];
const modulesFolder = path.resolve(__dirname, '../modules');

fs.readdirSync(modulesFolder).forEach(file => {
    try {
        const modFolder = path.resolve(modulesFolder, file);
        if (!fs.statSync(modFolder).isDirectory()) { return; }

        if (file.startsWith('_')) {
            bot.debug(`Skipped module '${file}' for preceding underscore`);
            return;
        }

        loadModule(file, true);
    } catch (err) {
        bot.error(`Failed to load module '${file}': ${err}`);
    }
});

function loadModule(id, skipCheck = false) {
    const modFolder = path.resolve(modulesFolder, id);

    if (!skipCheck && !fs.statSync(modFolder).isDirectory()) {
        throw `No module ${id} found`;
    }

    const ModObject = require(modFolder);
    const invalidReason = validateModule(ModObject);

    if (invalidReason) {
        throw `Error validating module '${id}': ${invalidReason}`;
    }

    // TODO: Remove first parameter to ModObject
    const mod = new ModObject({ bot }, id, modFolder);

    modules.push(mod);
    bot.login(`Loaded module ${id}`);
}

function runAll(methodName, ...params) {
    modules.forEach(mod => {
        if (typeof mod[methodName] === 'function') {
            mod[methodName].apply(mod, params);
        }
    });
}

function init() {
    runAll('init');
}

function getModule(modId) {
    return modules.find(mod => mod.id === modId);
}

function validateModule(ModObject) {
    if (!(ModObject.prototype instanceof Module)) { return 'not a Module class'; }
    //TODO: Check for duplicate module?
    return '';
}

module.exports = {
    init,
    getModule,
    runAll,
    loadModule
};
