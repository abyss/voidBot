const { send } = require('../../../utils/chat');
const bot = require('../../../bot');

exports.run = async (msg, args) => {
    if (!(args.length > 0)) {
        send(msg.channel, 'Unknown options');
        return false;
    }

    const cmd = bot.commands.lookup.getCommand(args.join(' '));

    if (!cmd) {
        await send(msg.channel, `Command not found: ${args.join(' ')}`);
        return true;
    }

    const mod = cmd.mod;

    try {
        bot.commands.loader.unload(cmd);
        bot.commands.loader.load(mod, cmd.id);
        await send(msg.channel, ':ok_hand:');
        return true;
    } catch (err) {
        await send(msg.channel, err.message);
        return true;
    }

};

const usage = new Map();
usage.set('<command>', 'Reload <command>');
exports.usage = usage;

exports.config = {
    name: 'Reload Command',
    cmd: 'reloadcommand',
    alias: ['reload', 'rc'],
    botPermissions: [], // Permissions needed by the bot to use this command.
    defaultPermissions: [], // Default permissions to use this command by user
    location: 'ALL', // 'GUILD_ONLY', 'DM_ONLY', 'ALL'
    description: 'Reload a command by id',
    debug: true // This makes it unusable to anyone besides process.env.OWNER
};
