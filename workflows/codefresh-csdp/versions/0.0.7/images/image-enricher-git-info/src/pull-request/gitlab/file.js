const _ = require('lodash');
const fileUtil = require('../../util/file.util');

const configuration = require('../../configuration');

class GitlabFile {

    async pullRequests() {
        const path = configuration.workingDirectory + '/event.json';
        const payload = await fileUtil.fetchFile(path);
        const pr = payload.object_attributes;
        if(pr) {
            const result = {
                number: pr.id,
                title: pr.title,
                url: pr.url,
                committers: [{
                    userName: _.get(payload, 'user.username'),
                    avatar: _.get(payload, 'user.avatar_url'),
                }],
            };
            return [result]
        }
        throw new Error(`PR section not found in ${path}, it can be if build was run not with PR event`);
    }

}
module.exports = new GitlabFile();
