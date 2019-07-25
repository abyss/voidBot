const database = require('../includes/database');
const path = require('path');
const fs = require('fs');
const { dataFolder } = require('../includes/config');

const fullDataFolder = path.resolve(__dirname, '../../', dataFolder);

if (!fs.existsSync(fullDataFolder)) {
    fs.mkdirSync(fullDataFolder);
}

database.init(fullDataFolder);

module.exports = database;
