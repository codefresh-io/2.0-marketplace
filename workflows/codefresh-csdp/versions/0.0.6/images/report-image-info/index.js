const { GraphQLClient, gql } = require('graphql-request')
const fs = require('fs')
const _ = require('lodash')
const AWS = require('aws-sdk');

const { registries: { GcrRegistry, EcrRegistry, DockerhubRegistry, StandardRegistry } } = require('nodegistry');

const CF_NOT_EXIST = 'cf-not-exist';

async function createRegistryClient() {

    if (process.env.DOCKER_USERNAME && process.env.DOCKER_PASSWORD
        && process.env.DOCKER_USERNAME!==CF_NOT_EXIST && process.env.DOCKER_PASSWORD!==CF_NOT_EXIST) {
        return new DockerhubRegistry({
            username: process.env.DOCKER_USERNAME,
            password: process.env.DOCKER_PASSWORD
        });
    }

    if (process.env.USERNAME && process.env.PASSWORD && process.env.DOMAIN
        && process.env.USERNAME!==CF_NOT_EXIST && process.env.PASSWORD!==CF_NOT_EXIST && process.env.DOMAIN!==CF_NOT_EXIST) {
        return new StandardRegistry({
            request: {
                protocol: process.env.INSECURE === 'true' ? 'http' : 'https',
                host: process.env.DOMAIN
            },
            credentials: {
                username: process.env.USERNAME,
                password: process.env.PASSWORD,
            },
        });
    }

    if (process.env.AWS_ROLE && process.env.AWS_ROLE!==CF_NOT_EXIST
        && process.env.AWS_REGION && process.env.AWS_REGION!==CF_NOT_EXIST) {
        console.log(`Retrieving credentials for ECR ${process.env.AWS_REGION} using STS token`);
        const sts = new AWS.STS();
        const timestamp = (new Date()).getTime();
        const params = {
            RoleArn: process.env.AWS_ROLE,
            RoleSessionName: `be-descriptibe-here-${timestamp}`
        }
        const data = await sts.assumeRole(params).promise();
        return new EcrRegistry({
            promise: Promise,
            credentials: {
                accessKeyId: data.Credentials.AccessKeyId,
                secretAccessKey: data.Credentials.SecretAccessKey,
                sessionToken: data.Credentials.SessionToken,
                region: process.env.AWS_REGION,
            },
        })
    }

    if (process.env.GCR_KEY_FILE_PATH) {
        return new GcrRegistry({
            keyfile: fs.readFileSync(process.env.GCR_KEY_FILE_PATH),
            request: { host: 'gcr.io' }
        });
    }
    if (process.env.AWS_ACCESS_KEY && process.env.AWS_ACCESS_KEY!==CF_NOT_EXIST
        && process.env.AWS_SECRET_KEY && process.env.AWS_SECRET_KEY!==CF_NOT_EXIST
        && process.env.AWS_REGION && process.env.AWS_REGION!==CF_NOT_EXIST) {
        return new EcrRegistry({
            promise: Promise,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
                region: process.env.AWS_REGION,
            },
        })
    }
    throw new Error('Registry credentials is required parameter. Add one from following registry parameters in your workflow to continue:\n - Docker credentials: DOCKER_USERNAME, DOCKER_PASSWORD\n - GCR credentials: GCR_KEY_FILE_PATH\n - AWS registry credentials: AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION\n - Standard registry credentials: USERNAME, PASSWORD, DOMAIN');
}

const init = async () => {

    const client = await createRegistryClient();

    const image = process.env.IMAGE_URI;
    const authorUserName = process.env.GIT_SENDER_LOGIN;
    const workflowName = process.env.WORKFLOW_NAME;

    const registry = client.repoTag(image);

    const manifest = await registry.getManifest();
    const config = await registry.getConfig(manifest);

    const size = manifest.config.size + _.reduce(manifest.layers, (sum, layer) => {
        return sum + layer.size;
    }, 0)

    const graphQLClient = new GraphQLClient(`${process.env.CF_HOST}/2.0/api/graphql`, {
        headers: {
            'Authorization': process.env.CF_API_KEY,
        },
    })

    const imageBinary = {
        id: manifest.config.digest,
        created: config.created,
        imageName: image,
        branch: process.env.GIT_BRANCH,
        commit: process.env.GIT_REVISION,
        commitMsg: process.env.GIT_COMMIT_MESSAGE,
        commitURL: process.env.GIT_COMMIT_URL,
        size: size,
        os: config.os,
        architecture: config.architecture,
        workflowName: workflowName,
        author: {
            username: authorUserName
        }
    }

    console.log('REPORT_IMAGE_V2: binaryQuery payload:', imageBinary)

    const binaryQuery = gql`mutation($imageBinary: ImageBinaryInput!){
        createImageBinary(imageBinary: $imageBinary) {
            id,
            imageName,
            branch,
            commit,
            commitMsg,
            commitURL,
            workflowName
        }
    }`
    const binaryResult = await graphQLClient.request(binaryQuery, { imageBinary })
    console.log('REPORT_IMAGE_V2: binaryQuery response:', JSON.stringify(binaryResult, null, 2))

    const imageRegistry = {
        binaryId: binaryResult.createImageBinary.id,
        imageName: image,
        repoDigest: manifest.config.repoDigest,
        created: config.created
    }

    const registryQuery = gql`mutation($imageRegistry: ImageRegistryInput!) {
        createImageRegistry(imageRegistry: $imageRegistry) {
            binaryId
            imageName
            repoDigest
        }
    }`

    const registryResult = await graphQLClient.request(registryQuery, { imageRegistry })
    console.log(JSON.stringify(registryResult, null, 2))
}

const validateRequiredEnvs = () => {
    if (_.isEmpty(process.env.IMAGE_URI)) {
        throw new Error('IMAGE_URI is required parameter. Add this parameter in your workflow to continue.');
    }
    if (_.isEmpty(process.env.CF_API_KEY)) {
        throw new Error('CF_API_KEY is required parameter. Add this parameter in your workflow to continue.');
    }
}

const main = async () => {
    try {
        validateRequiredEnvs();
        await init();
    } catch (err) {
        console.error(err.stack);
        process.exit(1);
    }
};

main();
