const bot = require('../../../bot');
const { send } = require('../../../utils/chat');
const { getGuildPrefix } = require('../../../utils/discord');
const { userColor } = require('../../../utils/colors');
const { sendCommandHelp } = require('../../../utils/chat');
const { stripIndentsExtra } = require('../../../utils/general');
const { checkDebug, moduleEnabled, hasPermission, validLocation } = require('../../../modular-commands/permissions');

exports.run = async (msg, args) => {
    const type = msg.channel.type;

    if (args.length === 0) {
        const commandStructure = {};
        const descriptions = {};

        for (const command of bot.commands.lookup.commands) {
            if (!validLocation(type, command)) continue;

            if (!checkDebug(msg.author, command)) continue;
            if (!await moduleEnabled(msg.guild, command.mod)) continue;
            if (!await hasPermission(msg.guild, msg.member, command)) continue;

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
                stripIndentsExtra`
                __**${modName}**__ **-** *${descriptions[modName]}*
                \`${commandStructure[modName].sort().join('`, `')}\``
            );
        }

        const color = userColor(bot.client.user.id, msg.guild);
        const prefix = await getGuildPrefix(msg.guild);

        const embed = {
            color: color,
            title: 'Command List',
            description:
                stripIndentsExtra`
                *Get more information on any command with* \`${prefix}${this.config.cmd} <command>\`
                *You can tag the bot instead of using a prefix!*

                ${modSection.join('\n\n')}`,
            author: {
                name: 'voidBot Help Command',
                icon_url: bot.client.user.avatarURL(),
            }
        };

        send(msg.channel, { embed: embed });

        return true;
    }

    if (args.length > 1) return false;

    if (args.length === 1) {
        const cmdText = args[0];
        const command = bot.commands.lookup.getCommand(cmdText);

        if (!command) return commandNotFound(msg.channel, cmdText);

        if (!validLocation(type, command))
            return commandNotFound(msg.channel, cmdText);

        if (!checkDebug(msg.author, command))
            return commandNotFound(msg.channel, cmdText);

        if (!await moduleEnabled(msg.guild, command.mod))
            return commandNotFound(msg.channel, cmdText);

        if (!await hasPermission(msg.guild, msg.member, command))
            return commandNotFound(msg.channel, cmdText);

        sendCommandHelp(msg.channel, command);
        return true;
    }
};

function commandNotFound(channel, cmdText) {
    send(channel, `Cannot find command: \`${cmdText}\`.`);
    return false;
}

const usage = new Map();
usage.set('', 'Get a list of all mods and commands you can use');
usage.set('<command>', 'Get help with <command>');
exports.usage = usage;

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
