const fileUtil = require('../../util/file.util');

const configuration = require('../../configuration');

class BitbucketFile {

    async pullRequests() {
        const path = configuration.workingDirectory + '/event.json';
        const pr = (await fileUtil.fetchFile(path)).pullrequest;
        if(pr) {
            const result = {
                number: pr.id,
                title: pr.title,
                url: pr.links.html.href,
            }
            return [result]
        }
        throw new Error(`PR section not found in ${path}, it can be if build was run not with PR event`);
    }

}
module.exports = new BitbucketFile();
