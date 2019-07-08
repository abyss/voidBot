const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { send, EXTENDED_FLAGS, userColor } = require('./helpers');

class CommandHandler {
    constructor(bot) {
        this.bot = bot;
        this.commands = [];
    }

    init() {
        this.TAG_REGEX = new RegExp(`^<@!?${this.bot.user.id}> `);
    }

    async getGuildPrefix(guild) {
        if (!guild) { return ''; }

        const prefix = await this.bot.db.get(guild.id, 'prefix');
        if (prefix) {
            return prefix;
        }

        return this.bot.config.prefix;
    }

    validLocation(message, command) {
        const type = message.channel.type;
        const loc = command.config.location;

        if (loc === 'ALL') { return true; }

        if (type === 'text' && loc === 'GUILD_ONLY') {
            return true;
        }

        if (type === 'dm' && loc === 'DM_ONLY') {
            return true;
        }

        return false;
    }

    async onMessage(message) {
        const processedCommand = await this.processMessage(message);

        // Not a command usage at all
        if (processedCommand.type === 'invalid') { return; }

        const command = this.getCommand(processedCommand.base);
        if (!command) { return; }

        if (!this.validLocation(message, command)) { return; }

        if (message.channel.type === 'text') {
            if (!await this.bot.handlers.permissions.hasPermission(message.guild, message.member, command)) {
                return;
            }
        }

        const runSuccessfully = await command
            .run(message, processedCommand.args)
            .catch(error => {
                send(message.channel, `**:interrobang:  |  An error has occured:** ${error}`);
                this.bot.error(`Command error in ${command.id}: ${error}`);
            });

        // Only print help if command returns explicit false, not undefined.
        if (runSuccessfully === false) {
            this.sendCommandHelp(message.channel, command);
        }
    }

    // MAYBE: Remove type from processMessage, return undefined when not proper command.
    async processMessage(message) {
        const cmdDetails = {
            type: 'invalid',
            base: '',
            args: []
        };

        const split = message.content.trim().split(/ +/);

        if (message.channel.type === 'dm' || message.channel.type === 'group') {
            cmdDetails.type = 'dm';
            cmdDetails.base = split[0];
            cmdDetails.args = split.slice(1);
            return cmdDetails;
        }

        // If it's not a DM and it's not a text channel, we're done here.
        if (message.channel.type !== 'text') {
            return cmdDetails;
        }

        let prefix = await this.getGuildPrefix(message.guild);

        if (message.content.startsWith(prefix)) {
            const newSplit = message.content.substr(prefix.length).trim().split(/ +/);

            cmdDetails.type = 'prefix';
            cmdDetails.base = newSplit[0];
            cmdDetails.args = newSplit.slice(1);
            return cmdDetails;
        }

        if (this.TAG_REGEX.test(message.content)) {
            cmdDetails.type = 'tag';
            cmdDetails.base = split[1];
            cmdDetails.args = split.slice(2);
            return cmdDetails;
        }

        return cmdDetails;
    }

    getCommand(cmdText) {
        return this.commands.find((cmd) => {
            if (cmd.config.cmd === cmdText) { return true; }
            if (cmd.config.alias.includes(cmdText)) { return true; }
            if (cmd.id === cmdText) { return true; }
        });
    }

    getCommandByID(cmdId) {
        return this.commands.find(c => c.id === cmdId);
    }

    validateCommand(command) {
        if (typeof command !== 'object') { return 'Exports are empty'; }
        if (typeof command.run !== 'function') { return 'Missing run function'; }
        if (typeof command.config !== 'object') { return 'Missing config object'; }
        if (typeof command.config.name !== 'string') { return 'Config object missing "name"'; }
        if (typeof command.config.cmd !== 'string') { return 'Config object missing "cmd"'; }
        if (typeof command.config.description !== 'string') { return 'Config object missing "description"'; }

        if (typeof command.config.location !== 'string') {
            this.bot.error(`Validation Error: '${command.id}' missing location. Using 'NONE'`);
            command.config.location = 'NONE';
        } else {
            let location = command.config.location;
            if (!['ALL', 'GUILD_ONLY', 'DM_ONLY', 'NONE'].includes(location)) {
                this.bot.error(`Validation Error: '${command.id}' invalid location. Using 'NONE'`);
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

        if (this.getCommand(command.config.cmd)) {
            return 'duplicate command';
        }

        if (command.config.alias.some(alias => this.getCommand(alias))) {
            return 'duplicate alias';
        }

    }

    registerCommand(command) {
        if (this.commands.includes(command)) {
            throw `Cannot register '${command.id}', already registered.`;
        }

        command.config.botPermissions.forEach(permission => {
            this.bot.config.registerPermission(permission);
        });

        this.commands.push(command);
    }

    unregisterCommand(command) {
        if (!this.commands.includes(command)) {
            throw `Cannot unregister '${command.id}', not registered.`;
        }

        _.pull(this.commands, command);
    }

    loadCommand(cmdText) {
        const split = cmdText.split('.');

        if (split.length !== 2) {
            throw `Load command ${cmdText} failed: not exactly one period.`;
        }

        const modId = split[0];
        const cmdId = split[1];

        const mod = this.bot.handlers.mods.getModule(modId);

        if (!mod) {
            throw `No module ${modId} found.`;
        }

        this.loadCommandFile(mod, `${cmdId}.js`);
    }

    unloadCommand(cmdText) {
        const split = cmdText.split('.');

        if (split.length !== 2) {
            throw `Load command ${cmdText} failed: not exactly one period.`;
        }

        const command = this.getCommand(cmdText);
        if (!command) {
            throw `No command ${cmdText} found.`;
        }

        const mod = command.mod;

        _.pull(mod.commands, command);
        this.unregisterCommand(command);
    }

    // Load an individual command from file for provided mod
    loadCommandFile(mod, file, skipCheck = false) {
        const fileLoc = path.resolve(mod.moduleFolder, file);

        try {
            if (!skipCheck && !fs.statSync(fileLoc).isFile()) {
                throw `${fileLoc} is not a file`;
            }
        } catch (error) {
            throw `No file './src/modules/${mod.id}/${file}' found`;
        }


        if (path.parse(file).ext !== '.js') {
            throw `Provided file '${file}' is not a js file`;
        }

        // Invalidate the cache incase it's been loaded before and changed
        delete require.cache[require.resolve(fileLoc.slice(0, -3))];
        const command = require(fileLoc.slice(0, -3));
        const cmdName = path.parse(file).name;
        const cmdId = `${mod.id}.${cmdName}`;

        // Load in the ID and mod reference
        command.id = cmdId;
        command.mod = mod;

        const check = this.validateCommand(command);
        if (check) {
            throw `Error validating command '${cmdId}': ${check}`;
        }

        mod.commands.push(command);
        this.registerCommand(command);

        this.bot.debug(`Loaded command '${cmdId}'`);
    }

    // Loads the commands for provided module
    loadModCommands(mod) {
        fs.readdirSync(mod.moduleFolder).forEach(file => {
            try {
                const fileLoc = path.resolve(mod.moduleFolder, file);

                if (!fs.statSync(fileLoc).isFile()) { return; }
                if (file === 'index.js') { return; }

                if (file.startsWith('_')) {
                    this.bot.debug(`Skipped command '${mod.id}.${path.parse(file).name}' for preceding underscore`);
                    return;
                }

                this.loadCommandFile(mod, file, true);
            } catch (error) {
                this.bot.error(`${error}`);
            }
        });
    }

    async sendCommandHelp(channel, command) {
        const color = userColor(this.bot.user.id, channel.guild);
        const prefix = await this.getGuildPrefix(channel.guild);
        const embedFields = [];

        let description;

        if (command.usage.size === 0) {
            description = '';
            embedFields.push({
                name: `${prefix}${command.config.cmd}`,
                value: command.config.description
            });
        } else {
            description = command.config.description;
            command.usage.forEach((value, key) => {
                embedFields.push({
                    name: `${prefix}${command.config.cmd} ${key}`,
                    value: value
                });
            });
        }

        const embed = {
            color: color,
            title: command.config.name,
            description: description,
            fields: embedFields,
            footer: {
                icon_url: this.bot.user.avatarURL,
                text: 'voidBot Help Command'
            }
        };

        send(channel, { 'embed': embed });
    }

}

module.exports = CommandHandler;
