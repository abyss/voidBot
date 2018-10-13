/* eslint-disable no-unused-vars */

class DBInterface {
    constructor(bot) {
        this.bot = bot;
    }

    get(guild, key) { }

    set(guild, key, data) { }

    delete(guild, key) { }
}

module.exports = DBInterface;
