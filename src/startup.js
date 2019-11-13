require('dotenv').config();
const path = require('path');
const fs = require('fs');

const bot = require('./bot');

// Startup Configuration
bot.config = require('./config');

// Startup Logger
const logger = require('./logger');
logger.init({ debug: bot.config.debug });
bot.log = logger.log;
bot.error = logger.error;
bot.debug = logger.debug;

// Startup Database
const fullDataFolder = path.resolve(__dirname, '../../', bot.config.dataFolder);

if (!fs.existsSync(fullDataFolder)) {
    fs.mkdirSync(fullDataFolder);
}

const database = require('./database');
database.init(fullDataFolder);
bot.db = database;

// Startup Command Management
bot.commands = require('./modular-commands');

bot.commands.modules.loadAll();
