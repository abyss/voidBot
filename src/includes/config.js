const { parseBoolean, getId } = require('./helpers');

const owners = process.env.OWNER.split(',');

const prefix = process.env.DEFAULTPREFIX || '/';

const debug = parseBoolean(process.env.DEBUG);

const version = process.env.npm_package_version;

const permissions = new Set(['SEND_MESSAGES', 'READ_MESSAGES']);

const registerPermission = (perm) => {
    permissions.add(perm);
    module.exports.permissions = [...permissions];
};

const isOwner = (user) => {
    if (!user) return false;
    const id = getId(user);
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
