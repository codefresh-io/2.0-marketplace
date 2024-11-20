const fileUtil = require('../../util/file.util');
const _ = require('lodash');
const githubApiCommon = require('./github.api.common');
const configuration = require('../../configuration');

class GithubFile {

    async pullRequests() {
        const path = configuration.workingDirectory + '/event.json';
        const pr = (await fileUtil.fetchFile(path)).pull_request;
        if(pr) {
            const info = await githubApiCommon.extractCommitsInfo(pr.number);

            const result = {
                ...info,
                number: pr.number,
                title: pr.title,
                url: pr.url.replace(`api.${configuration.githubHost}/repos`, configuration.githubHost).replace("/pulls/", "/pull/"),
                branch: _.get(pr, 'head.ref'),
            }
            return [result]
        }
        throw new Error(`PR section not found in ${path}, it can be if build was run not with PR event`);
    }

}
module.exports = new GithubFile();
