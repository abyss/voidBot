const path = require('path');

class Module {
    constructor(handler, id, moduleDir) {
        this.handler = handler;
        this.bot = handler.bot;
        this.id = id;
        this.commands = [];

        this.moduleFolder = path.resolve(moduleDir);

        this.bot.handlers.commands.loadModCommands(this);
    }

    get config() {
        return {
            name: 'ModuleClass',
            description: 'ModuleClass',
            debug: true // This makes it unusable to anyone besides process.env.OWNER
        };
    }

    // Called when bot logs into Discord. Keep in mind, this may be called multiple times.
    init() { }

    // Called when the bot disconnects from Discord
    disconnect() { }

    toString() {
        return `[Module ${this.id}]`;
    }
}

module.exports = Module;
