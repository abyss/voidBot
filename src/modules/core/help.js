const { send, userColor } = require('../../includes/helpers');
const { stripIndents } = require('common-tags');

exports.run = async (msg, args) => {
    if (args.length === 0) {
        const commandStructure = {};
        const descriptions = {};

        const type = msg.channel.type;
        for (const command of this.mod.bot.handlers.commands.commands) {
            if (!this.mod.bot.handlers.commands.validLocation(msg, command)) {
                continue;
            }

            if (type !== 'dm' && type !== 'group') {
                if (!await this.mod.hasPermission(msg.guild, msg.member, command)) {
                    continue;
                }
            }

            const modName = command.mod.config.name;

            if (!commandStructure[modName]) {
                commandStructure[modName] = [];
                descriptions[modName] = command.mod.config.description;
            }

            commandStructure[modName].push(command.config.cmd);
        }

        const modSection = [];

        for (const modName of Object.keys(commandStructure).sort()) {
            modSection.push(
                stripIndents`
                __**${modName}**__ **-** *${descriptions[modName]}*
                \`${commandStructure[modName].sort().join('`, `')}\``
            );
        }

        const color = userColor(this.mod.bot.user.id, msg.guild);
        const prefix = await this.mod.bot.handlers.commands.getGuildPrefix(msg.guild);

        const embed = {
            color: color,
            title: 'Command List',
            description:
                stripIndents`
                *Get more information on any command with* \`${prefix}${this.config.cmd} <command>\`
                *You can tag the bot instead of using a prefix!*

                ${modSection.join('\n\n')}`,
            footer: {
                icon_url: this.mod.bot.user.avatarURL,
                text: 'voidBot Help Command'
            }
        };
        send(msg.channel, { embed: embed });

        return true;
    }

    if (args.length > 1) {
        send(msg.channel, 'Unknown options');
        return false;
    }

    if (args.length === 1) {
        const cmdText = args[0];
        const command = this.mod.bot.handlers.commands.getCommand(cmdText);
        let found = false;

        // Check each step of the way, if any fail, flag as "can't find."
        if (command) {
            found = true;
        }

        // only check location if it was found
        if (found && !this.mod.bot.handlers.commands.validLocation(msg, command)) {
            found = false; // this command doesn't exist for this user
        }

        // if this isn't a dm or group, check permissions for command.
        const type = msg.channel.type;
        if (found && type !== 'dm' && type !== 'group') {
            found = await this.mod.hasPermission(msg.guild, msg.member, command);
        }

        if (!found) {
            send(msg.channel, `Cannot find command: \`${cmdText}\`.`);
            return false;
        } else {
            this.mod.bot.handlers.commands.sendCommandHelp(msg.channel, command);
            return true;
        }
    }

};

// Usage is a Map where each key is the usage, and the value is the description
exports.usage = new Map([
    ['', 'Get help with commands and the bot'],
    ['<command>', 'Get help with <command>'],
]);

exports.config = {
    name: 'Help Command',
    cmd: 'help',
    alias: [],
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL' - where the command can be used
    description: 'Get details on how to use any command',
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
