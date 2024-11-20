const { host, apiToken, image, branch } = require('./configuration');
const rp = require('request-promise');
const _ = require('lodash');
const chalk = require('chalk');

class CodefreshAPI {
    _handleError(e) {
        if (_.get(e, 'error.message')) {
            const code = _.get(e, 'error.code')
            const statusCode = _.get(e, 'error.status')
            const message = _.get(e, 'error.message')
            throw new Error(`Codefresh error ${statusCode} [${code}]: ${message}`)
        }

        throw e
    }

    async getContext(name) {
        try {
            return await rp({
                method: 'GET',
                uri: `${host}/api/contexts/${name}?decrypt=true`,
                headers: {
                    'Authorization': `Bearer ${apiToken}`
                },
                json: true
            });
        } catch (e) {
            return this._handleError(e);
        }
    }

    async createPullRequestV2(pullRequest) {
        console.log(chalk.green(`Create pull request ${pullRequest.number}=${pullRequest.url}, image ${image}`));
        try {
            const body = {
                "operationName":"saveAnnotation",
                "variables":{
                    "annotation":{
                        "logicEntityId": {"id": image},
                        "entityType":"image",
                        "key": `#${pullRequest.number}`,
                        "type": "pr",
                        "pullRequestValue": {
                            url: pullRequest.url,
                            title: pullRequest.title,
                            committers: pullRequest.committers,
                            commits: pullRequest.commits,
                        }
                    }
                },
                "query":"mutation saveAnnotation( $annotation: AnnotationArgs!) {\n saveAnnotation(annotation: $annotation)\n}"
            }
            return await rp({
                method: 'POST',
                uri: `${host}/2.0/api/graphql`,
                body,
                headers: {
                    'Authorization': `Bearer ${apiToken}`
                },
                json: true
            });
        } catch (e) {
            return this._handleError(e);
        }

    }

    async createPullRequest(pullRequest) {

        console.log(chalk.green(`Create pull request ${pullRequest.number}=${pullRequest.url}, image ${image}`));

        try {
            return await rp({
                method: 'POST',
                uri: `${host}/api/annotations`,
                body: {
                    entityId: image,
                    entityType: 'image-prs',
                    key: `#${pullRequest.number}`,
                    value: {
                        url: pullRequest.url,
                        title: pullRequest.title,
                        committers: pullRequest.committers
                    },
                    bigValue: {
                        firstCommitDate: pullRequest.firstCommitDate,
                        lastCommitDate: pullRequest.lastCommitDate,
                        prDate: pullRequest.prDate,
                        branch,
                        commits: pullRequest.commits,
                    }
                },
                headers: {
                    'Authorization': `Bearer ${apiToken}`
                },
                json: true
            });
        } catch (e) {
            return this._handleError(e);
        }
    }

}

module.exports = new CodefreshAPI();
