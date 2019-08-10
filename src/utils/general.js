exports.asyncForEach = async function asyncForEach(array, callback) {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i], i, array);
    }
};

exports.parseBoolean = function (input) {
    if (typeof input === 'string') {
        input = input.toLowerCase();
        if (input === 'false') { return false; }
        if (input === '0') { return false; }
        if (input === 'no') { return false; }
        if (input === 'off') { return false; }
    }

    if (input) return true;
    else return false;
};
