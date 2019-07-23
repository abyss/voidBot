const { parseBoolean, resolveId } = require('./helpers');

if (!process.env.TOKEN || !/^[A-Za-z0-9._-]+$/.test(process.env.TOKEN)) {
    console.error('Environment variable TOKEN is missing or incorrect.');
    process.exit(1);
}

const owners = process.env.OWNER ? process.env.OWNER.split(',') : '';

const prefix = process.env.DEFAULTPREFIX || '/';

const debug = parseBoolean(process.env.DEBUG);

const version = process.env.npm_package_version;

const permissions = new Set(['SEND_MESSAGES', 'VIEW_CHANNEL']);

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
    owners,
    prefix,
    debug,
    version,
    isOwner,
    registerPermission,
    permissions: [...permissions]
};
