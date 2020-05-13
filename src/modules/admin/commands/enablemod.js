const bot = require('../../../bot');
const { send } = require('../../../utils/chat');
const { getModule } = require('../../../modular-commands/mod-loader');

async function unknownOptions(channel) {
    await send(channel, 'Unknown module');
    return false;
}

exports.run = async (msg, args) => {
    const mod = getModule(args.join(' '));

    if (!mod || (mod.config.private && !bot.config.isOwner(msg.author)))
        return unknownOptions(msg.channel);

    await bot.db.set(msg.guild, `modules.${mod.id}`, true);
    await send(msg.channel, ':ok_hand:');
};

const usage = new Map();
usage.set('<module>', 'Enable <module> on server');
exports.usage = usage;

exports.config = {
    name: 'Enable Module',
    cmd: 'enablemod',
    alias: ['enablemodule', 'enmod', 'enmodule'],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: ['MANAGE_GUILD'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Allows enabling modules per server',
    debug: false // This makes it unusable to anyone besides process.env.OWNER
};
