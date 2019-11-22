const path = require('path');
const fs = require('fs');
const bot = require('../bot');
const hashmap = require('./hashmap');

const { EXTENDED_FLAGS } = require('../utils/discord');
const modulesFolder = bot.config.modulesFolder;

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

function unloadModCommands(mod) {
    const commands = hashmap.commands.filter(cmd => cmd.mod === mod);
    commands.forEach(cmd => unload(cmd));
}

function load(mod, id) {
    const file = path.resolve(modulesFolder, mod.id, 'commands', `${id}.js`);
    const cmd = loadCommandFile(file);

    if (!cmd) {
        throw new Error(`Command '${id}' from module '${mod.id}' not found.`);
    }

    const result = validateCommand(cmd);

    if (!result.valid) {
        throw new Error(`Error validating command '${id}' from module '${mod.id}': ${result.message}`);
    }

    cmd.mod = mod;
    cmd.id = id;

    hashmap.add(cmd);
    bot.debug(`Loaded command '${id}' from module '${mod.id}'`);

    return cmd;
}

function loadCommandFile(file) {
    if (!fs.existsSync(file)) return;
    if (!fs.statSync(file).isFile()) return;
    if (!path.extname(file) === 'js') return;

    delete require.cache[require.resolve(file)];

    const cmd = require(file);
    return cmd;
}

function unload(cmd) {
    hashmap.remove(cmd);
    bot.debug(`Unloaded command '${cmd.id}' from module '${cmd.mod.id}'`);
}

function reload(id) {
    const cmd = hashmap.getCommand(id);
    const mod = cmd.mod;

    unload(cmd);
    load(mod, id);
}

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

    if (hashmap.getCommand(cmd.config.cmd))
        return { valid: false, message: 'duplicate command or alias' };

    return { valid: true, message: '' };
}

module.exports = {
    loadModCommands,
    unloadModCommands,
    load,
    unload,
    reload
};
