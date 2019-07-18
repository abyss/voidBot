const LowDBHandler = require('../includes/lowdb-handler');
const path = require('path');
const fs = require('fs');

module.exports = (bot) => {
    const dataFolder = path.resolve(__dirname, '../../data');

    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder);
    }

    return new LowDBHandler(bot, dataFolder);
};
