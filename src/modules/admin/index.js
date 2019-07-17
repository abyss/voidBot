const Module = require('../../includes/module-class');
const { findRole, asyncForEach } = require('../../includes/helpers');

module.exports = class AdminModule extends Module {
    get config() {
        return {
            name: 'Administration',
            description: 'Administrative guild control',
            debug: false // This makes it unusable to anyone besides process.env.OWNER
        };
    }

    init() {
        this.bot.on('guildCreate', guild => {
            this.serverStats(guild);
            this.bot.log(`Joined new guild: ${guild.name} (${guild.id})`);
            this.bot.log(`Users: ${this.bot.users.size}, Guilds: ${this.bot.guilds.size}`);
        });

        this.allServerStats();
        this.bot.setInterval(() => { this.allServerStats(); }, 1000 * 60 * 30); // Every 30 minutes
    }

    async allServerStats() {
        asyncForEach(this.bot.guilds.array(), async (guild) => await this.serverStats(guild));
    }

    async serverStats(guild) {
        const stats = {
            id: guild.id,
            name: guild.name,
            owner: {
                id: guild.id,
                tag: guild.owner.user.tag
            }
        };

        await this.bot.db.set(guild.id, 'serverStats', stats);
    }

    async changePermissions(guild, cmdText, roleText, state) {
        let command = this.bot.handlers.commands.getCommand(cmdText);

        if (!guild.available) {
            this.bot.error(`Guild: ${guild} not available.`);
            throw 'Guild not available. Please try again later';
        }

        if (!command) {
            throw `No command ${cmdText} found.`;
        }

        if (!(state === 'allow' || state === 'deny' || state === 'default')) {
            throw `Invalid state: ${state}`;
        }

        let role = findRole(guild, roleText);

        if (!role) {
            throw `Role ${roleText} not found.`;
        }

        return this.bot.handlers.permissions.setCommandPermission(guild.id, command.id, role.id, state);
    }

    async setGuildPrefix(guild, prefix) {
        return this.bot.db.set(guild.id, 'prefix', prefix);
    }

    async getGuildPrefix(guild) {
        return this.bot.handlers.commands.getGuildPrefix(guild);
    }

    async hasPermission(guild, member, command) {
        return this.bot.handlers.permissions.hasPermission(guild, member, command);
    }

};
