const CommandHandler = require('../includes/command-handler');
const ModuleHandler = require('../includes/module-handler');

module.exports = function init(bot) {
    const cmdHandler = new CommandHandler(bot);
    const modHandler = new ModuleHandler(bot);

    bot.cmdHandler = cmdHandler;
    bot.modHandler = modHandler;
};
