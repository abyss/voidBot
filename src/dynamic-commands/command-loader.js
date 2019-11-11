const path = require('path');
const fs = require('fs');
const bot = require('../bot');
const { EXTENDED_FLAGS } = require('../utils/discord');
const modulesFolder = bot.config.modulesFolder;

const commands = [];
const commandLookup = new Map(); // TODO: Extract commandLookup to own module?

function loadModCommands(mod) {
    const modsCommands = [];
    const commandsFolder = path.resolve(modulesFolder, mod.id, 'commands');

    fs.readdirSync(commandsFolder).forEach(file => {
        try {
            const id = path.parse(file).name;

            const cmd = load(mod, id);
            modsCommands.push(cmd);
        } catch (err) {
            bot.error(err);
        }
    });

    return modsCommands;
}

function load(mod, id) {
    const cmd = loadCommand(mod, id);
    commands.push(cmd);
    // TODO: Add cmd to commandLookup
    bot.debug(`Loaded command '${id}' from module '${mod.id}'`);

    return cmd;
}

function loadCommand(mod, id) {
    const file = path.resolve(modulesFolder, mod.id, 'commands', id);
    const cmd = loadCommandFile(file);

    cmd.mod = mod;
    cmd.id = id;

    const check = validateCommand(cmd);
    if (check) {
        throw new Error(`Error validating command '${id}' from module '${mod.id}': check`);
    }
    return cmd;
}

function loadCommandFile(file) {
    if (!fs.existsSync(file + '.js')) { return; }
    if (!fs.statSync(file + '.js').isFile()) { return; }

    delete require.cache[require.resolve(file)];

    const cmd = require(file);
    return cmd;
}

function getCommand(id) {
    return commands.find(cmd => cmd.id === id);
}

function unload(cmd) {
    const index = commands.indexOf(cmd);
    commands.splice(index, 1);

    rebuildCommandLookup();
}

function reload(id) {
    const cmd = getCommand(id);
    const mod = cmd.mod;

    unload(cmd);
    load(mod, id);
}

function rebuildCommandLookup() {
    commandLookup.clear();
    // TODO: Rebuild commandLookup
}

// TODO: Convert this from returning strings to returning an object { valid: boolean, msg: string }
function validateCommand(command) {
    if (typeof command !== 'object') { return 'Exports are empty'; }
    if (typeof command.run !== 'function') { return 'Missing run function'; }
    if (typeof command.config !== 'object') { return 'Missing config object'; }
    if (typeof command.config.name !== 'string') { return 'Config object missing "name"'; }
    if (typeof command.config.cmd !== 'string') { return 'Config object missing "cmd"'; }
    if (typeof command.config.description !== 'string') { return 'Config object missing "description"'; }

    if (typeof command.config.location !== 'string') {
        bot.error(`Validation Error: '${command.id}' missing location. Using 'NONE'`);
        command.config.location = 'NONE';
    } else {
        let location = command.config.location;
        if (!['ALL', 'GUILD_ONLY', 'DM_ONLY', 'NONE'].includes(location)) {
            bot.error(`Validation Error: '${command.id}' invalid location. Using 'NONE'`);
            command.config.location = 'NONE';
        }
    }

    if (!(command.config.alias instanceof Array)) {
        command.config.alias = [];
    }

    if (!(command.config.botPermissions instanceof Array)) {
        command.config.botPermissions = [];
    }

    if (!(command.config.defaultPermissions instanceof Array)) {
        command.config.defaultPermissions = [];
    }

    for (const permission of command.config.defaultPermissions) {
        if (!(permission in EXTENDED_FLAGS)) {
            return `Improper Default Permission ${permission} in ${command.id}`;
        }
    }

    if (!(command.usage instanceof Map)) {
        command.usage = new Map();
    }

    if (getCommand(command.config.cmd)) {
        return 'duplicate command';
    }

    if (command.config.alias.some(alias => getCommand(alias))) {
        return 'duplicate alias';
    }
}

module.exports = {
    commands,
    commandLookup,
    getCommand,
    rebuildCommandLookup,
    loadModCommands,
    load,
    unload,
    reload
};
