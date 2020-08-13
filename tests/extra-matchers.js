const Util = require('discord.js').Util;

expect.extend({
    toBeValidURL(received) {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        const matches = !!pattern.test(received);
        const expected = matches ? 'an invalid' : 'a valid';
        return {
            message: () => `expected ${received} to be ${expected} URL`,
            pass: matches
        };
    },

    toBeColorResolvable(received) {
        const pass = {
            message: () =>
                `expected ${received} to not be a Discord.js ColorResolvable`,
            'pass': true
        };

        const fail = {
            message: () =>
                `expected ${received} to be a Discord.js ColorResolvable`,
            'pass': false
        };

        try {
            const color = Util.resolveColor(received);
            return isNaN(color) ? fail : pass;
        } catch (err) {
            return fail;
        }
    },

    embedContaining(received, containing) {
        const pass = {
            message: () => {
                `expected ${received} not to be Embed containing ${containing}`;
            },
            'pass': true
        };

        const fail = {
            message: () => {
                `expected ${received} to be Embed containing ${containing}`;
            },
            'pass': false
        };

        try {
            if (!received) return fail;

            if (typeof received.title === 'string') {
                if (received.title.includes(containing)) return pass;
            }

            if (typeof received.description === 'string') {
                if (received.description.includes(containing)) return pass;
            }

            if (Array.isArray(received.fields)) {
                for (let embedField of received.fields) {
                    if (embedField.name.includes(containing)) return pass;
                    if (embedField.value.includes(containing)) return pass;
                }
            }

            return fail;
        } catch (err) {
            return fail;
        }
    }
});
