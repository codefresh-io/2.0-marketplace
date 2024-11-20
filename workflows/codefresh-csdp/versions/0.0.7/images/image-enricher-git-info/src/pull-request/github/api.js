const _ = require('lodash');
const { Octokit } = require("@octokit/rest");
const configuration = require('../../configuration');
const githubApiCommon = require('./github.api.common');


class GithubApi {

    async pullRequests() {
        const octokit = new Octokit({
            auth: configuration.contextCreds,
            baseUrl: configuration.baseUrl
        });

        const { branch, repo } = configuration;
        console.log(`Looking for PRs from ${repo} repo and ${branch} branch`);

        const prs = await octokit.search.issuesAndPullRequests({ q: `head:${branch}+type:pr+repo:${repo}`  });
        return Promise.all(prs.data.items.map(async (pr) => {
            const info = await githubApiCommon.extractCommitsInfo(pr.number);
            const result = {
                ...info,
                prDate: pr.closed_at || pr.updated_at,
                number: pr.number,
                url: `https://${configuration.githubHost}/${repo}/pull/${pr.number}`,
                title: pr.title,
            }

            return result;
        }));
    }
}
module.exports = new GithubApi();
