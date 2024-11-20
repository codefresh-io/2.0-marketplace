module.exports = {
    docker: {
        username: process.env.DOCKER_USERNAME?.trim(),
        password: process.env.DOCKER_PASSWORD?.trim(),
    },
    dockerConfigPath: process.env.DOCKER_CONFIG_FILE_PATH?.trim(),
    generic: {
        request: {
            protocol: process.env.INSECURE?.trim() === 'true' ? 'http' : 'https',
            host: process.env.DOMAIN?.trim(),
        },
        credentials: {
            username: process.env.USERNAME?.trim(),
            password: process.env.PASSWORD?.trim(),
        }
    },
    aws: {
        role: process.env.AWS_ROLE?.trim(),
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY?.trim(),
            secretAccessKey: process.env.AWS_SECRET_KEY?.trim(),
            region: process.env.AWS_REGION?.trim(),
        }
    },
    gcr: {
        keyFilePath: process.env.GCR_KEY_FILE_PATH?.trim(),
    },
    git: {
        branch: process.env.GIT_BRANCH?.trim(),
        commit: process.env.GIT_REVISION?.trim(),
        commitMsg: process.env.GIT_COMMIT_MESSAGE?.trim(),
        commitURL: process.env.GIT_COMMIT_URL?.trim(),
        author: process.env.GIT_SENDER_LOGIN?.trim(),
    },
    workflow: {
        name: process.env.WORKFLOW_NAME?.trim(),
    },
    image: {
        uri: process.env.IMAGE_URI?.trim(),
    },
    codefresh: {
        host: process.env.CF_HOST?.trim(),
        apiKey: process.env.CF_API_KEY?.trim(),
    },
    retrieveCredentialsByDomain: process.env.RETRIEVE_CREDENTIALS_BY_DOMAIN?.trim() === 'true'
};
