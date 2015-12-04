var fs = require('fs');
var file = fs.createWriteStream('/tmp/log.txt');

/**
 * Exports a single function
 */
module.exports = function log(what) {
    var date = new Date();
    file.write(JSON.stringify({
        when: date.toJSON(),
        what: what
    }) + '\n');
};
