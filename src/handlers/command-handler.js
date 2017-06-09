const fs = require('fs');
const path = require('path');

class CommandHandler {
    constructor(bot) {
        this.bot = bot;
        this.commands = [];

    }

    init() {
        this.TAG_REGEX = new RegExp(`^<@!?${this.bot.user.id}> `);
    }

    async onMessage(message) {
        const processedCommand = this.processCommandAttempt(message);
        if (processedCommand.type === 'invalid') { return; }

        const command = this.getCommand(processedCommand.base);
        if (!command) { return; }

        //TODO: Respect debug, location, etc
        command.run(message, processedCommand.args).catch(error => {
            message.channel.send(`:interrobang:  |  An error has occured: ${error}`);
            this.bot.error(`Command error in ${command.id}: ${error}`);
        });
    }

    processCommandAttempt(message) {
        const cmdDetails = {
            type: 'invalid',
            base: '',
            args: []
        };

        const split = message.content.trim().split(' ');

        if (message.channel.type === 'dm') {
            cmdDetails.type = 'dm';
            cmdDetails.base = split[0];
            cmdDetails.args = split.slice(1);
            return cmdDetails;
        }

        if (this.TAG_REGEX.test(message.content)) {
            cmdDetails.type = 'tag';
            cmdDetails.base = split[1];
            cmdDetails.args = split.slice(2);
            return cmdDetails;
        }

        if (message.content.startsWith(this.bot.config.prefix)) {
            const prefixLength = this.bot.config.prefix.length;
            const newSplit = message.content.substr(prefixLength).trim().split(' ');

            cmdDetails.type = 'prefix';
            cmdDetails.base = newSplit[0];
            cmdDetails.args = newSplit.slice(1);
            return cmdDetails;
        }

        return cmdDetails;
    }

    getCommand(cmdText) {
        return this.commands.find((cmd) => {
            if (cmd.config.cmd === cmdText) { return true; }
            if (cmd.config.alias.includes(cmdText)) { return true; }
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
            return 'Config object missing "location"';
        } else {
            let location = command.config.location;
            if (!['ALL', 'GUILD_ONLY', 'DM_ONLY'].includes(location)) {
                return 'Config object location is incorrect';
            }
        }

        // TODO: Make these optional, if not included, add them as empty.
        if (!(command.config.alias instanceof Array)) { return 'Config object missing "alias" array'; }
        if (!(command.config.permissions instanceof Array)) { return 'Config object missing "permissions" array'; }

        // TODO: Check for duplicates of command or alias.
    }

    registerCommand(command) {
        if (this.commands.includes(command)) {
            throw `${command.id} is already registered.`;
        }

        command.config.permissions.forEach(permission => {
            this.bot.config.registerPermission(permission);
        });

        this.commands.push(command);
    }

    unregisterCommand(command) { // eslint-disable-line
        // TODO: Remove Command from commands
    }

    loadCommand(cmdId) { // eslint-disable-line
        //TODO: Load a command from cmdId
        // Find module, find command
        // Pass to loadCommandFile()
        // this.loadCommandFile(mod, `${command}.js`, skipCheck);
    }

    // Load an individual command from file for provided mod
    loadCommandFile(mod, file, skipCheck = false) {
        const fileLoc = path.resolve(mod.moduleFolder, file);

        if (!skipCheck && !fs.statSync(fileLoc).isFile()) {
            throw `No file '${fileLoc}' found`;
        }

        if (path.parse(file).ext !== '.js') {
            throw `Provided file '${file}' is not a js file`;
        }

        const command = require(fileLoc.slice(0, -3));
        const cmdName = path.parse(file).name;
        const cmdId = `${mod.id}.${cmdName}`;

        const check = this.validateCommand(command);
        if (check) {
            throw `Error validating command '${cmdId}': ${check}`;
        }

        command.id = cmdId;
        command.mod = mod;

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

}

module.exports = CommandHandler;
