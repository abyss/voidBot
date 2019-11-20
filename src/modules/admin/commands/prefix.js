const bot = require('../../../bot');
const { send } = require('../../../utils/chat');
const { getGuildPrefix } = require('../../../utils/discord');

exports.run = async (msg, args) => {
    if (args.length > 0) {
        await bot.db.set(msg.guild, 'prefix', args.join(' '));
        await send(msg.channel, ':ok_hand:');
    } else {
        // show current prefix
        await send(msg.channel, 'This prefix for this guild is: ' +
            `\`${await getGuildPrefix(msg.guild)}\``);
    }

    return true;
};

const usage = new Map();
usage.set('', 'Output the current prefix for the guild');
usage.set('<prefix>', 'Change the prefix to <prefix>');
exports.usage = usage;

exports.config = {
    name: 'Set Prefix',
    cmd: 'prefix',
    alias: [],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: ['MANAGE_GUILD'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Sets the bot prefix for the server',
    debug: false // This makes it unusable to anyone besides process.env.OWNER
};
