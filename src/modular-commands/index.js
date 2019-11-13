const permissions = require('./permissions');
const modules = require('./mod-loader');
const loader = require('./cmd-loader');
const processor = require('./processor');
const lookup = require('./hashmap');

module.exports = {
    permissions,
    modules,
    loader,
    processor,
    lookup
};
