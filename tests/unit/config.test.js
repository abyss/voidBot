process.env.TOKEN = 'FakeToken';
process.env.OWNER = '12345';

// Mock bot because config requires discord requires bot,
// and we don't want to load the entire bot startup.
jest.mock('../../src/bot', () => ({}));

const config = require('../../src/config');

describe('config unit tests', () => {
    test('modulesFolder is set and is a string', () => {
        expect(config.modulesFolder).toEqual(expect.any(String));
    });

    test('dataFolder is set and is a string', () => {
        expect(config.dataFolder).toEqual(expect.any(String));
    });

    test('owners is set and is an Array', () => {
        expect(config.owners).toEqual(expect.any(Array));
    });

    test('prefix is set and is a string', () => {
        expect(config.prefix).toEqual(expect.any(String));
    });

    test('version is set and is a string', () => {
        expect(config.version).toEqual(expect.any(String));
    });

    test('permissions is set and is an Array', () => {
        expect(config.permissions).toEqual(expect.any(Array));
    });

    describe('registerPermission', () => {
        test('correctly adds a permission', () => {
            const perm = 'ADMINISTRATOR';
            config.registerPermission(perm);
            expect(config.permissions).toEqual(expect.arrayContaining([perm]));
        });
    });

    describe('isOwner', () => {
        let user, owner;

        beforeAll(() => {
            // Mock resolveId
            user = { id: '54321' };
            owner = { id: '12345' };
        });

        test('returns false if user is not set', () => {
            const result = config.isOwner(undefined);
            expect(result).toBeFalsy();
        });

        test('returns true if user is an owner', () => {
            const result = config.isOwner(owner);
            expect(result).toBeTruthy();
        });

        test('returns false if user is not an owner', () => {
            config.owners = [];
            const result = config.isOwner(user);
            expect(result).toBeFalsy();
        });
    });
});
