// Mock bot because config requires discord requires bot,
// and we don't want to load the entire bot startup.
jest.mock('../../src/bot', () => ({}));

process.env.TOKEN = 'FakeToken';
process.env.DATA_FOLDER = '.tests-unit-database';

const path = require('path');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const fs = require('fs');
const config = require('../../src/config');
const logger = require('../../src/logger');

const dataFolder = path.resolve(__dirname, '../../', config.dataFolder);
// delete the dataFolder if it still exists
fs.rmdirSync(dataFolder, { recursive: true });

const database = require('../../src/database');

async function createDb(name) {
    const jsonFile = path.resolve(dataFolder, `${name}.json`);
    const adapter = new FileAsync(jsonFile);
    return low(adapter);
}

describe('database unit tests', () => {
    afterAll(() => {
        fs.rmdirSync(dataFolder, { recursive: true });
    });

    describe('get', () => {
        let dbName, key, data, dbHandle;

        beforeAll(async () => {
            dbName = 'get-method';
            key = 'test-key';
            data = 'test-data';

            dbHandle = await createDb(dbName);
            await dbHandle.set(key, data).write();
        });

        test('logs error when guild is non-id resolvable (undefined)', async () => {
            const guild = undefined;
            const loggerErrorToRestore = logger.error;
            logger.error = jest.fn();

            await database.get(guild, key);

            expect(logger.error).toHaveBeenCalled();

            logger.error = loggerErrorToRestore;
        });

        test('retrieves correct value from database', async () => {
            const result = await database.get(dbName, key);
            expect(result).toBe(data);
        });
    });

    describe('set', () => {
        let dbName, key, data, dbHandle;

        beforeAll(async () => {
            dbName = 'set-method';
            key = 'test-key';
            data = 'test-data';

            dbHandle = await createDb(dbName);
        });

        test('logs error when guild is non-id resolvable (undefined)', async () => {
            const guild = undefined;
            const loggerErrorToRestore = logger.error;
            logger.error = jest.fn();

            await database.set(guild, key);

            expect(logger.error).toHaveBeenCalled();

            logger.error = loggerErrorToRestore;
        });

        test('sets correct value in database', async () => {
            await database.set(dbName, key, data);

            await dbHandle.read(); // refresh in-memory
            const result = await dbHandle.get(key).value();

            expect(result).toBe(data);
        });
    });

    describe('delete', () => {
        let dbName, key, data, dbHandle;

        beforeAll(async () => {
            dbName = 'set-method';
            key = 'test-key';
            data = 'test-data';

            dbHandle = await createDb(dbName);
            await dbHandle.set(key, data).write();
        });

        test('logs error when guild is non-id resolvable (undefined)', async () => {
            const guild = undefined;
            const loggerErrorToRestore = logger.error;
            logger.error = jest.fn();

            await database.delete(guild, key);

            expect(logger.error).toHaveBeenCalled();

            logger.error = loggerErrorToRestore;
        });

        test('deletes correct key from database', async () => {
            await database.delete(dbName, key);

            await dbHandle.read(); // refresh in-memory
            const result = await dbHandle.get(key).value();

            expect(result).toBe(undefined);
        });
    });
});
