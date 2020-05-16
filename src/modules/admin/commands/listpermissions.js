const bot = require('../../../bot');
const { send } = require('../../../utils/chat');
const { getGuildPrefix } = require('../../../utils/discord');
const { MessageEmbed } = require('discord.js');
const { stripIndentsExtra } = require('../../../utils/general');
const { userColor } = require('../../../utils/colors');

async function getCommandPermOutput(command, guild, perms, showDefault = false) {
    let output = '';
    const commandPermissions = [];
    let everyoneModified = false;
    let changedDefault = false;

    // Permissions in Database
    for (let [roleId, rolePerm] of Object.entries(perms)) {
        const role = guild.roles.cache.get(roleId);
        if (!role) continue;

        commandPermissions.push({
            position: role.calculatedPosition,
            role: role,
            perm: rolePerm
        });

        changedDefault = true;
        if (role.id === guild.id) everyoneModified = true;
    }

    commandPermissions.sort((a, b) => b.position - a.position);

    commandPermissions.forEach(cmdPerm => {
        output += `${cmdPerm.role} - ${cmdPerm.perm}\n`;
    });

    // Skip any commands that are purely default
    if (!showDefault && !changedDefault) return;

    // Default Permissions
    const defaultPerms = command.config.defaultPermissions;
    if (defaultPerms.includes('NOONE')) {
        if (!everyoneModified) output += '**(DEFAULT)** @everyone - deny';
    } else if (defaultPerms.length === 0) {
        if (!everyoneModified) output += '**(DEFAULT)** @everyone - allow';
    } else {
        output += `**(DEFAULT)** ${defaultPerms.join(',')} - allow`;
    }

    const prefix = await getGuildPrefix(guild.id);

    return {
        title: `${prefix}${command.config.cmd}`,
        content: output
    };
}

async function listAllPermissions(msg) {
    const embed = new MessageEmbed();

    let permissions = await bot.db.get(msg.guild, 'permissions');
    if (typeof permissions !== 'object') permissions = {};

    for (let [cmdKey, perms] of Object.entries(permissions)) {
        const command = bot.commands.lookup.getCommand(cmdKey);
        if (!command) {
            // exists in the db but not in the bots commands?
            bot.debug(`listAllPermissions: skipped listing ${cmdKey} because no command found.`);
            continue;
        }
        const field = await getCommandPermOutput(command, msg.guild, perms);
        if (field)
            embed.addField(field.title, field.content);
    }

    embed
        .setTitle('List of All Permissions')
        .setColor(userColor(bot.client.user.id, msg.guild))
        .setDescription(stripIndentsExtra`
            *This only includes permissions of commands that are not default. \
            To see the default permissions of any other commands, \
            run* \`listpermissions <command>\`

            The highest position role in Discord a user has will take \
            precedence.`);

    await send(msg.channel, embed);
}

async function listCommandPermissions(msg, cmdText) {
    const command = bot.commands.lookup.getCommand(cmdText);
    if (!command) {
        await send(msg.channel, 'Command not found');
        return false;
    }

    const permissions = await bot.db.get(msg.guild, `permissions.${command.id}`);
    const field = await getCommandPermOutput(command, msg.guild, permissions, true);

    if (field) {
        const embed = new MessageEmbed()
            .setTitle(`Permissions for: ${field.title}`)
            .setColor(userColor(bot.client.user.id, msg.guild))
            .setDescription(field.content);

        await send(msg.channel, embed);
    } else {
        await send(msg.channel, 'Unknown error generating command permissions output.');
    }
}

exports.run = async (msg, args) => {
    if (args.length)
        return await listCommandPermissions(msg, args.join(' '));

    return await listAllPermissions(msg);
};

const usage = new Map();
usage.set('', 'list all permissions for the current server');
usage.set('<command>', 'list permissions for the given command');
exports.usage = usage;

exports.config = {
    name: 'List Permissions',
    cmd: 'listpermissions',
    alias: ['listperm', 'listperms', 'listpermission'],
    botPermissions: [], // Guild permissions needed by the bot to use this command.
    defaultPermissions: ['MANAGE_GUILD'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'List permissions for commands or roles',
    preventLockout: true, // Prevent a user from removing their own permission to this command
    debug: false // If true: unusable to anyone besides process.env.OWNER
};
