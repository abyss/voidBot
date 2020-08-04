const path = require('path');

const { parseBoolean } = require('./utils/general');
const { resolveId } = require('./utils/discord');

if (!process.env.TOKEN || !/^[A-Za-z0-9._-]+$/.test(process.env.TOKEN)) {
    console.error('Environment variable TOKEN is missing or incorrect.');
    process.exit(1);
}

const modulesFolder = path.resolve(__dirname, 'modules');

const dataFolder = process.env.DATA_FOLDER || 'data';

const owners = process.env.OWNER ? process.env.OWNER.split(',') : '';

const prefix = process.env.DEFAULT_PREFIX || '/';

const debug = parseBoolean(process.env.DEBUG);

const version = process.env.npm_package_version;

const permissions = new Set();

const registerPermission = (perm) => {
    permissions.add(perm);
    module.exports.permissions = [...permissions];
};

const isOwner = (user) => {
    if (!user) return false;
    const id = resolveId(user);
    return owners.includes(id);
};

module.exports = {
    modulesFolder,
    dataFolder,
    owners,
    prefix,
    debug,
    version,
    isOwner,
    registerPermission,
    permissions: [...permissions]
};
