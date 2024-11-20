// registering error handler
require('./outputs')
const { parseQualifiedNameOptimized, parseFamiliarName } = require('@codefresh-io/docker-reference')
const { GraphQLClient, gql, ClientError } = require('graphql-request')
const _ = require('lodash')

const { OUTPUTS, storeOutputParam } = require('./outputs')
const createRegistryClient = require('./registry-client')
const configuration = require('./configuration');

async function main() {
    console.log('starting image reporter')

    const [ validationError, inputs ] = configuration.validateInputs()

    if (validationError) {
        throw validationError
    }

    const image = inputs.imageName;
    const client = await createRegistryClient(image);

    const workflowName = inputs.workflow.name;
    const workflowUrl = inputs.workflow.workflowUrl;
    const logsUrl = inputs.workflow.logsUrl;

    const registry = client.repoTag(image);

    const manifest = await registry.getManifest();
    const config = await registry.getConfig(manifest);

    // store in FS to use as an output param later (in argo workflow)
    storeOutputParam(OUTPUTS.IMAGE_NAME, image)
    storeOutputParam(OUTPUTS.IMAGE_SHA, manifest.config.digest)
    const repositoryName = _.get(parseFamiliarName(image, parseQualifiedNameOptimized), 'repository')
    const imageLink = `${inputs.codefresh.host}/2.0/images/${encodeURIComponent(repositoryName)}/${manifest.config.digest}/${encodeURIComponent(image)}`
    storeOutputParam(OUTPUTS.IMAGE_LINK, imageLink)

    const size = manifest.config.size + _.reduce(manifest.layers, (sum, layer) => {
        return sum + layer.size;
    }, 0);

    const graphQLClient = new GraphQLClient(`${inputs.codefresh.host}/2.0/api/graphql`, {
        headers: {
            'Authorization': inputs.codefresh.apiKey,
        },
    });

    const imageBinaryVars = {
        imageBinary: {
            id: manifest.config.digest,
            created: config.created,
            imageName: image,
            size: size,
            os: config.os,
            architecture: config.architecture,
            workflowName: workflowName,
            workflowUrl,
            logsUrl,
        }
    };

    console.log('binaryMutation payload:', imageBinaryVars.imageBinary);
    
    const binaryMutation = gql`mutation($imageBinary: ImageBinaryInput!){
        createImageBinary(imageBinary: $imageBinary) {
            id,
            imageName,
            workflowName
        }
    }`;
    const binaryResult = await graphQLClient.request(binaryMutation, imageBinaryVars)
        .catch(_handleQlError('failed to create image binary'));

    console.log(JSON.stringify(binaryResult, null, 2));

    const imageRegistryVars = {
        imageRegistry: {
            binaryId: binaryResult.createImageBinary.id,
            imageName: image,
            repoDigest: manifest.config.repoDigest,
            created: config.created
        }
    };

    console.log('registryMutation payload:', imageRegistryVars.imageRegistry);

    const registryMutation = gql`mutation($imageRegistry: ImageRegistryInput!) {
        createImageRegistry(imageRegistry: $imageRegistry) {
            binaryId
            repoDigest
        }
    }`;

    const registryResult = await graphQLClient.request(registryMutation, imageRegistryVars)
        .catch(_handleQlError('failed to create image registry'));

    console.log(JSON.stringify(registryResult, null, 2));

    console.log('image reported successfully');
}

const _handleQlError = (prefix) => (e) => {
    let formattedMessage
    if (e instanceof ClientError) {
        if (e.response.status !== 200) {
            formattedMessage = e.response.error
        } else {
            const qlErrorMessage = _.get(e, 'response.errors.0.message')
            if (qlErrorMessage) {
                formattedMessage = qlErrorMessage
            }
        }
    }
    throw new Error(prefix
        ? `${prefix} (${formattedMessage || e.message})`
        : formattedMessage || e.message);
}

main();
