const path = require('path');

class Module {
    constructor(handler, id) {
        this.handler = handler;
        this.bot = handler.bot;
        this.id = id;
        this.commands = [];

        this.moduleFolder = path.resolve(__dirname, id);

        this.bot.commandHandler.loadModCommands(this);
    }

    get config() {
        return {
            name: 'ModuleClass',
            description: 'ModuleClass',
            debug: true // This makes it unusable to anyone besides process.env.OWNER
        };
    }

    // Called when bot loads, before login to Discord. One-time setup methods.
    preInit() { }

    // Called when bot logs into Discord. Keep in mind, this may be called multiple times.
    init() { }

    // Called when the bot disconnects from Discord
    disconnect() { }

    toString() {
        return `[Module ${this.id}]`;
    }
}

module.exports = Module;
