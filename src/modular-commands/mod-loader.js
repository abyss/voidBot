const path = require('path');
const fs = require('fs');
const bot = require('../bot');
const { loadModCommands, unloadModCommands } = require('./cmd-loader');
const modulesFolder = bot.config.modulesFolder;

const modules = [];

function loadAll() {
    fs.readdirSync(modulesFolder).forEach(file => {
        try {
            const modFolder = path.resolve(modulesFolder, file);
            if (!fs.statSync(modFolder).isDirectory()) { return; }

            if (file.startsWith('_')) {
                bot.debug(`Skipped module '${file}' for preceding underscore`);
                return;
            }

            load(file);
        } catch (err) {
            bot.error(`Failed to load module '${file}': ${err}`);
        }
    });
}

function validateModule(module) {
    if (typeof module !== 'object')
        return { valid: false, message: 'Not an object' };

    if (typeof module.config !== 'object')
        return { valid: false, message: 'Missing config object' };

    if (typeof module.config.name !== 'string')
        return { valid: false, message: 'Config object missing "name"' };

    if (typeof module.config.enabled !== 'boolean') {
        module.config.enabled = true;
        bot.debug(`Validation Error: '${module.id}' missing enabled. Using 'true'`);
    }

    if (typeof module.config.description !== 'string')
        return { valid: false, message: 'Config object missing "description"' };

    if (typeof module.config.debug !== 'boolean') {
        module.config.debug = false;
        bot.debug(`Validation Error: '${module.id}' missing debug. Using 'false'`);
    }

    if (typeof module.config.private !== 'boolean')
        module.config.private = false;

    return { valid: true, message: '' };
}

function load(id) {
    const modFolder = path.resolve(modulesFolder, id);
    const mod = loadModuleFile(modFolder);

    mod.id = id;

    const result = validateModule(mod);
    if (!result.valid) {
        throw new Error(`Error validating module '${id}': ${result.message}`);
    }

    loadModCommands(mod);
    modules.push(mod);

    bot.log(`Loaded module ${id}`);
}

function loadModuleFile(modFolder) {
    if (!fs.existsSync(modFolder) || !fs.statSync(modFolder).isDirectory()) {
        throw new Error(`No module ${path.basename(modFolder)} folder found`);
    }

    const mod = require(modFolder);

    return mod;
}

function unload(id) {
    const mod = getModule(id);
    const index = modules.indexOf(mod);
    modules.splice(index, 1);
    unloadModCommands(mod);

    bot.log(`Unloaded module ${id}`);
}

function getModule(id) {
    return modules.find(mod => mod.id === id);
}

function reload(id) {
    unload(id);
    load(id);
}

module.exports = {
    modules,
    loadAll,
    getModule,
    load,
    unload,
    reload
};
