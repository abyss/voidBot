jest.mock('../../src/logger', () => ({
    error: jest.fn()
}));

jest.mock('../../src/utils/discord', () => ({
    getGuildPrefix: jest.fn(),
    userColor: jest.fn()
}));

jest.mock('../../src/bot', () => ({
    client: {
        user: {
            id: 1,
            avatarURL: jest.fn()
        }
    }
}));

const chat = require('../../src/utils/chat');

describe('chat util', () => {
    describe('send', () => {
        test('channel.send is called', () => {
            const channel = {
                send: jest.fn().mockResolvedValue()
            };
            const message = 'test message';
            chat.send(channel, message);

            expect(channel.send).toHaveBeenCalled();
        });

        test('error in send is properly handled', async () => {
            const unhandledRejection = jest.fn();
            process.on('unhandledRejection', unhandledRejection);

            const channel = {
                send: jest.fn().mockRejectedValue()
            };

            const message = 'test message';
            await chat.send(channel, message);

            expect(channel.send).toHaveBeenCalled();
            expect(unhandledRejection).not.toHaveBeenCalled();
        });
    });

    describe('sendCommandHelp', () => {
        const channel = {
            guild: '1',
            send: jest.fn().mockResolvedValue()
        };

        const command = {
            config: {
                cmd: 'test',
                name: 'Test',
                description: 'test description',
            },
            usage: new Map()
        };

        test('sends embed object', async () => {
            await chat.sendCommandHelp(channel, command);

            const expected = expect.objectContaining({
                embed: expect.any(Object)
            });

            expect(channel.send).toBeCalledWith(expected);
            channel.send.mockClear();
        });

        test.todo('embed object has author.name');
        test.todo('embed object has author.icon_url');
        test.todo('embed object has color');
        test.todo('embed object has title');
        test.todo('command with no usage generates field based on description');
        test.todo('command with usage generates fields based on usage');
        test.todo('command with usage generates description field');
    });
});
