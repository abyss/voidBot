const path = require('path');
const fs = require('fs');
const bot = require('../bot');
const { loadModCommands, unloadModCommands } = require('./cmd-loader');
const modulesFolder = bot.config.modulesFolder;

const modules = [];

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

function load(id) {
    const modFolder = path.resolve(modulesFolder, id);
    const mod = loadModuleFile(modFolder);

    mod.id = id;

    loadModCommands(mod);
    modules.push(mod);

    bot.log(`Loaded module ${id}`);
}

function loadModuleFile(modFolder) {
    if (!fs.existsSync(modFolder) || !fs.statSync(modFolder).isDirectory()) {
        throw new Error(`No module ${path.basename(modFolder)} folder found`);
    }

    const mod = require(modFolder);
    // TODO: Validate Module

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
    getModule,
    load,
    unload,
    reload
};
