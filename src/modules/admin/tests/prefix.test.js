// Mock bot because config requires discord requires bot,
// and we don't want to load the entire bot startup.
jest.mock('../../../bot', () => ({
    db: {
        set: jest.fn()
    }
}));

jest.mock('../../../utils/chat', () => ({
    send: jest.fn()
}));

jest.mock('../../../utils/discord', () => ({
    getGuildPrefix: jest.fn()
}));

const discord = require('../../../utils/discord');
const bot = require('../../../bot');
const { send } = require('../../../utils/chat');
const prefix = require('../commands/prefix');

describe('admin.prefix command', () => {
    let msg;

    beforeAll(() => {
        msg = {
            channel: {},
            guild: {}
        };
    });

    afterEach(() => {
        bot.db.set.mockClear();
        send.mockClear();
    });

    test('sets prefix if passed a prefix argument', async () => {
        const args = ['!'];
        await prefix.run(msg, args);
        expect(bot.db.set).toHaveBeenCalled();
    });

    test('notifies user if passed a prefix argument', async () => {
        const args = ['!'];
        await prefix.run(msg, args);
        expect(send).toHaveBeenCalled();
    });

    test('returns true if passed a prefix argument', async () => {
        const args = ['1'];
        const result = await prefix.run(msg, args);
        expect(result).toBeTruthy();
    });

    test('lists prefix if passed no arguments', async () => {
        const args = [];
        const guildPrefix = '%';
        discord.getGuildPrefix.mockReturnValue(guildPrefix);

        await prefix.run(msg, args);

        expect(send).toHaveBeenCalledWith(
            msg.channel,
            expect.stringContaining(guildPrefix)
        );
    });

    test('returns true if passed no arguments', async () => {
        const args = [];
        const result = await prefix.run(msg, args);
        expect(result).toBeTruthy();
    });
});
