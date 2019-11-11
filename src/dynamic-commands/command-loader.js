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

    const result = validateCommand(cmd);

    if (!result.valid) {
        throw new Error(`Error validating command '${id}' from module '${mod.id}': ${result.message}`);
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
function validateCommand(cmd) {
    if (typeof cmd !== 'object')
        return { valid: false, message: 'Not an object' };

    if (typeof cmd.run !== 'function')
        return { valid: false, message: 'Missing run function' };

    if (typeof cmd.config !== 'object')
        return { valid: false, message: 'Missing config object' };

    if (typeof cmd.config.name !== 'string')
        return { valid: false, message: 'Config object missing "name"' };

    if (typeof cmd.config.cmd !== 'string')
        return { valid: false, message: 'Config object missing "cmd"' };

    if (typeof cmd.config.description !== 'string')
        return { valid: false, message: 'Config object missing "description"' };

    if (typeof cmd.config.location !== 'string') {
        bot.error(`Validation Error: '${cmd.id}' missing location. Using 'NONE'`);
        cmd.config.location = 'NONE';
    } else {
        let location = cmd.config.location;
        if (!['ALL', 'GUILD_ONLY', 'DM_ONLY', 'NONE'].includes(location)) {
            bot.error(`Validation Error: '${cmd.id}' invalid location. Using 'NONE'`);
            cmd.config.location = 'NONE';
        }
    }

    if (!(cmd.config.alias instanceof Array))
        cmd.config.alias = [];


    if (!(cmd.config.botPermissions instanceof Array))
        cmd.config.botPermissions = [];


    if (!(cmd.config.defaultPermissions instanceof Array))
        cmd.config.defaultPermissions = [];

    for (const permission of cmd.config.defaultPermissions) {
        if (!(permission in EXTENDED_FLAGS)) {
            return {
                valid: false,
                message: `Improper Default Permission ${permission} in ${cmd.id}`
            };
        }
    }

    if (!(cmd.usage instanceof Map))
        cmd.usage = new Map();

    if (getCommand(cmd.config.cmd))
        return { valid: false, message: 'duplicate command' };

    if (cmd.config.alias.some(alias => getCommand(alias)))
        return { valid: false, message: 'duplicate alias' };

    return { valid: true, message: '' };
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
