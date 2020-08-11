// Mock bot because config requires discord requires bot,
// and we don't want to load the entire bot startup.
jest.mock('../../src/bot', () => ({}));

describe('config.token unit tests', () => {
    test('config throws on missing token', () => {
        delete process.env.TOKEN;

        const consoleErrorToRestore = console.error;
        console.error = jest.fn();

        expect(() => {
            require('../../src/config');
        }).toThrow();

        console.error = consoleErrorToRestore;
    });
});
