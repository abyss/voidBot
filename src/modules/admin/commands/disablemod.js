const bot = require('../../../bot');
const { send } = require('../../../utils/chat');
const { getModule } = require('../../../modular-commands/mod-loader');

exports.run = async (msg, args) => {
    const mod = getModule(args.join(' '));
    if (!mod) {
        await send(msg.channel, 'Unknown module');
        return false;
    }

    await bot.db.set(msg.guild, `modules.${mod.id}`, false);
    await send(msg.channel, ':ok_hand:');
};

const usage = new Map();
usage.set('<module>', 'Disable <module> on server');
exports.usage = usage;

exports.config = {
    name: 'Disable Module',
    cmd: 'disablemod',
    alias: ['disablemodule', 'dismod', 'dismodule'],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: ['MANAGE_GUILD'], // Default permissions to use this command by user
    location: 'GUILD_ONLY', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Allows disabling modules per server',
    debug: false // This makes it unusable to anyone besides process.env.OWNER
};
