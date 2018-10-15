const { send, resolveColor } = require('../../includes/helpers');

// TODO: Finish this command.

exports.run = async (msg, args) => {
    if (args.length === 0) {
        // TODO: Show generic help
        return true;
    }

    if (args.length > 1) {
        // TODO: this needs to do something
        return false;
    }

    if (args.length === 1) {
        // TODO: Check that they have permission for this command / correct context (or display context to user?)
        let command = this.mod.bot.commandHandler.getCommand(args[0]);
        if (!command) {
            // TODO: this needs to do something
            return false;
        }

        let color;

        if (msg.guild) {
            color = msg.guild.members.get(this.mod.bot.user.id).displayColor;
        } else {
            color = resolveColor('C27C0E');
        }

        const embedFields = [];
        const prefix = await this.mod.getGuildPrefix(msg.guild);
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
                icon_url: this.mod.bot.user.avatarURL,
                text: 'voidBot Help Command'
            }
        };

        send(msg.channel, { 'embed': embed });
        return true;
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
    debug: true // If true: unusable to anyone besides process.env.OWNER
};
