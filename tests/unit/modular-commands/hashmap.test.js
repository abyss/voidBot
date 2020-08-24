const hashmap = require('../../../src/modular-commands/hashmap');

describe('modular-commands - hashmap unit tests', () => {
    describe('basic add and remove', () => {
        let command;
        beforeAll(() => {
            command = {
                config: {
                    cmd: 'test-command',
                    alias: []
                }
            };
        });

        test('adds a command to commands', () => {
            hashmap.add(command);

            expect(hashmap.commands).toEqual(expect.arrayContaining([command]));
        });

        test('removes command from commands', () => {
            hashmap.remove(command);

            expect(hashmap.commands).toEqual(expect.not.arrayContaining([command]));
        });
    });

    describe('getCommand', () => {
        let command;
        beforeAll(() => {
            command = {
                config: {
                    cmd: 'test-command',
                    alias: ['alias']
                }
            };

            hashmap.add(command);
        });

        afterAll(() => {
            hashmap.remove(command);
        });

        test('can get command by cmd', () => {
            const result = hashmap.getCommand(command.config.cmd);

            expect(result).toBe(command);
        });

        test('can get command by aliases', () => {
            const result = hashmap.getCommand(command.config.alias[0]);

            expect(result).toBe(command);
        });

        test('is case insensitive', () => {
            const cmd = command.config.cmd;
            const upperCase = cmd.toUpperCase();
            const lowerCase = cmd.toLowerCase();

            const upperResult = hashmap.getCommand(upperCase);
            const lowerResult = hashmap.getCommand(lowerCase);

            expect(upperResult).toBe(command);
            expect(lowerResult).toBe(command);
        });

        test('returns undefined for a command not found', () => {
            const result = hashmap.getCommand('not-found');

            expect(result).toBeUndefined();
        });
    });

    describe('remove', () => {
        let command;

        beforeAll(() => {
            command = {
                config: {
                    cmd: 'test-command',
                    alias: ['alias']
                }
            };
        });

        test('returns false if command is not in hashmap', () => {
            const nonExistentCommand = {
                config: {
                    cmd: 'does-not-exist',
                    alias: []
                }
            };

            const result = hashmap.remove(nonExistentCommand);

            expect(result).toBeFalsy();
        });

        test('removes cmd from hashmap', () => {
            hashmap.add(command);
            hashmap.remove(command);

            const result = hashmap.getCommand(command.config.cmd);

            expect(result).toBeUndefined();
        });

        test('removes aliases from hashmap', () => {
            hashmap.add(command);
            hashmap.remove(command);

            const result = hashmap.getCommand(command.config.alias[0]);

            expect(result).toBeUndefined();
        });
    });

    describe('rebuild', () => {
        let command;

        beforeAll(() => {
            command = {
                config: {
                    cmd: 'test-command',
                    alias: ['alias']
                }
            };

            hashmap.add(command);
        });

        afterAll(() => {
            hashmap.remove(command);
        });

        test('does not throw', () => {
            expect(() => {
                hashmap.rebuild();
            }).not.toThrow();
        });

        test('can still find commands by cmd after rebuild', () => {
            hashmap.rebuild();

            const result = hashmap.getCommand(command.config.cmd);

            expect(result).toBe(command);
        });

        test('can still find commands by alias after rebuild', () => {
            hashmap.rebuild();

            const result = hashmap.getCommand(command.config.alias[0]);

            expect(result).toBe(command);
        });
    });
});
