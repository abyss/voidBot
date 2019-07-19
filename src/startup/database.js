const database = require('../includes/database');
const path = require('path');
const fs = require('fs');

const dataFolder = path.resolve(__dirname, '../../data');

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

database.init(dataFolder);

module.exports = database;
