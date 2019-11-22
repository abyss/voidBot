const { send } = require('../../../utils/chat');
const bot = require('../../../bot');

exports.run = async (msg, args) => {
    if (!(args.length > 1)) {
        send(msg.channel, 'Unknown options');
        return false;
    }

    const modId = args[0];
    const cmdId = args[1];

    const mod = bot.commands.modules.getModule(modId);
    if (!mod) {
        await send(msg.channel, `Mod not found: ${modId}`);
        return true;
    }

    try {
        bot.commands.loader.load(mod, cmdId);
        await send(msg.channel, ':ok_hand:');
        return true;
    } catch (err) {
        await send(msg.channel, err.message);
        return true;
    }
};

const usage = new Map();
usage.set('<mod> <command>', 'Load <command> from <mod>');
exports.usage = usage;

exports.config = {
    name: 'Load Command',
    cmd: 'loadcommand',
    alias: ['load', 'lc'],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Load a command by id',
    debug: true // This makes it unusable to anyone besides process.env.OWNER
};
