const _ = require('lodash');
const codefreshApi = require('./codefresh.api');
const config = require('./configuration');

class Initializer {

    async getToken() {
        if (config.githubToken) {
            return {
                type: 'git.github',
                token: config.githubToken,
                apiHost: config.githubAPI || 'api.github.com',
                apiPathPrefix: config.apiPathPrefix || '/'
            };
        }
        const context = await codefreshApi.getContext(config.contextName);
        const type = context.spec.type;
        const token = context.spec.data.auth.password;
        const apiPathPrefix = _.get(context, 'spec.data.auth.apiPathPrefix', '/');
        const apiHost = _.get(context, 'spec.data.auth.apiHost', 'api.github.com');
        return { type, token, apiPathPrefix, apiHost };
    }

    async _prepareConfig() {
        const { type, token, apiHost, apiPathPrefix } = await this.getToken();

        config.baseUrl = this._buildRequestUrl(apiHost, apiPathPrefix);
        config.contextType = type;
        config.contextCreds = token;
    }

    _buildRequestUrl(apiHost, apiPathPrefix) {
        // Sanitizing URL for supporting all formats existing in DB
        // Normalize parts of url in format: (host)(/pathPrefix)
        const host = apiHost.replace(/\/$/, ""); // remove the last slash

        let pathPrefix = apiPathPrefix.replace(/\/$/, ""); // remove the last slash
        if (pathPrefix && pathPrefix[0] !== '/') {
            pathPrefix = `/${pathPrefix}`; // ensure left slash
        }

        return `https://${host}${pathPrefix}`;
    }

    async init() {
        await this._prepareConfig();
    }

}
module.exports = new Initializer();
