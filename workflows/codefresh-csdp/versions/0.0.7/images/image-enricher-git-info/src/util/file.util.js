const Promise = require('bluebird');
const fs = require('fs');

class FileUtil {

    async fetchFile(path) {
        try {
            return JSON.parse(await Promise.fromCallback((cb) => fs.readFile(path, 'utf8', cb)));
        } catch(e) {
            throw new Error(`${path} file not found`);
        }
    }

}

module.exports = new FileUtil();
