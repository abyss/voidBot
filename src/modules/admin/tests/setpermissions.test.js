jest.mock('../../../bot', () => ({
    db: {
        get: jest.fn()
    },
    commands: {
        lookup: {
            getCommand: jest.fn()
        }
    },
    debug: jest.fn(),
    client: {
        user: {
            id: '12345'
        }
    }
}));

jest.mock('../../../utils/chat', () => ({
    send: jest.fn()
}));

jest.mock('../../../utils/discord', () => ({
    findRole: jest.fn()
}));

const bot = require('../../../bot');
const chat = require('../../../utils/chat');
const discord = require('../../../utils/discord');
const setpermissions = require('../commands/setpermissions');

describe('admin.setpermissions command', () => {
    let msg, args;

    beforeAll(() => {
        msg = {
            channel: {},
            guild: {}
        };

        args = ['ping', 'everyone', 'allow'];
    });

    afterEach(() => {
        chat.send.mockClear();
    });

    test('run with less than 3 arguments returns false', async () => {
        const result = await setpermissions.run(msg, [1, 2]);

        expect(result).toBe(false);
    });

    test('command not found returns false', async () => {
        bot.commands.lookup.getCommand.mockReturnValue(undefined);

        const result = await setpermissions.run(msg, args);

        expect(result).toBe(false);
    });

    test('role not found returns false', async () => {
        discord.findRole.mockReturnValue(undefined);

        const result = await setpermissions.run(msg, args);

        expect(result).toBe(false);
    });

    test('state not allowed returns false', async () => {
        args[2] = 'InvalidState';

        const result = await setpermissions.run(msg, args);

        expect(result).toBe(false);
    });
});
