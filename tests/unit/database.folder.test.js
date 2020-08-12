// Mock bot because config requires discord requires bot,
// and we don't want to load the entire bot startup.
jest.mock('../../src/bot', () => ({}));

process.env.TOKEN = 'FakeToken';
process.env.DATA_FOLDER = '.tests-unit-database-folder';

const path = require('path');
const fs = require('fs');
const config = require('../../src/config');

const dataFolder = path.resolve(__dirname, '../../', config.dataFolder);

describe('database unit tests', () => {
    test('creates folder if it does not exist', () => {
        // delete the dataFolder if it still exists
        fs.rmdirSync(dataFolder, { recursive: true });

        require('../../src/database');

        const exists = fs.existsSync(dataFolder);
        const isDir = fs.statSync(dataFolder).isDirectory();

        expect(exists).toBeTruthy();
        expect(isDir).toBeTruthy();

        fs.rmdirSync(dataFolder, { recursive: true });
    });
});
