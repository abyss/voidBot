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

const disablemod = require('../commands/disablemod');

describe('admin.disablemod command', () => {
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

        const result = await disablemod.run(msg, args);

        expect(result).toBe(false);
    });


    test('sets in db if mod found', async () => {
        modLoader.getModule.mockReturnValue(mockModule);

        await disablemod.run(msg, args);

        expect(bot.db.set).toHaveBeenCalledWith(
            msg.guild,
            expect.stringContaining('test'),
            false
        );
    });

});
