jest.mock('../../../bot', () => ({
    db: {
        set: jest.fn()
    },
    config: {
        isOwner: jest.fn()
    }
}));

jest.mock('../../../utils/chat', () => ({
    send: jest.fn()
}));

jest.mock('../../../modular-commands/mod-loader', () => ({
    getModule: jest.fn()
}));

const bot = require('../../../bot');
const modLoader = require('../../../modular-commands/mod-loader');

const enablemod = require('../commands/enablemod');

describe('admin.enablemod command', () => {
    let msg, args;
    let mockModule;

    beforeAll(() => {
        msg = {
            author: {},
            channel: {},
            guild: {}
        };

        args = ['test'];

        mockModule = {
            id: 'test',
            config: {
                name: 'Test',
                enabled: true,
                description: 'Module used for testing',
                debug: false,
                private: false
            }
        };
    });

    afterAll(() => {
        bot.db.set.mockClear();
    });

    test('returns false if mod not found', async () => {
        modLoader.getModule.mockReturnValue(undefined);
        bot.config.isOwner.mockReturnValue(true);

        const result = await enablemod.run(msg, args);

        expect(result).toBe(false);
    });

    test('return false if private mod and msg author is not owner', async () => {
        mockModule.config.private = true;
        modLoader.getModule.mockReturnValue(mockModule);
        bot.config.isOwner.mockReturnValue(false);

        const result = await enablemod.run(msg, args);

        expect(result).toBe(false);
    });

    test('sets in db if private mod and msg author is an owner', async () => {
        mockModule.config.private = true;
        modLoader.getModule.mockReturnValue(mockModule);
        bot.config.isOwner.mockReturnValue(true);

        await enablemod.run(msg, args);

        expect(bot.db.set).toHaveBeenCalledWith(
            msg.guild,
            expect.stringContaining('test'),
            true
        );
    });

    test('sets in db if not private mod and msg author is not owner', async () => {
        mockModule.config.private = false;
        modLoader.getModule.mockReturnValue(mockModule);
        bot.config.isOwner.mockReturnValue(false);

        await enablemod.run(msg, args);

        expect(bot.db.set).toHaveBeenCalledWith(
            msg.guild,
            expect.stringContaining('test'),
            true
        );
    });

    test('sets in db if not private mod and msg author is an owner', async () => {
        mockModule.config.private = false;
        modLoader.getModule.mockReturnValue(mockModule);
        bot.config.isOwner.mockReturnValue(true);

        await enablemod.run(msg, args);

        expect(bot.db.set).toHaveBeenCalledWith(
            msg.guild,
            expect.stringContaining('test'),
            true
        );
    });
});
