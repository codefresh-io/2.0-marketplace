# report-image-info

## Summary
Report image info to argo platform.

## Inputs/Outputs

### Inputs
* IMAGE (required) - your image to which you want to report
* CF_API_KEY (required) - Codefresh API key created by runtime
* GIT_BRANCH (optional) - git branch
* GIT_REVISION (optional) - git revision
* GIT_COMMIT_MESSAGE (optional) - git commit message
* GIT_COMMIT_URL (optional) - git commit url
* GIT_SENDER_LOGIN (optional) - git commiter username
* CF_HOST (optional) - support on-premises Codefresh URL
* INSECURE (optional) - security flag for standard registry protocol, when set to true it enables http protocol.
#### Specify one from following required registry parameters:
* GCR_KEY_FILE_PATH (required) - JSON key for authenticating to a Google GCR
* GCR_KEY_SECRET (required) - The Kubernetes secret containing the GCR key information. Default is 'gcr-key-file'
* GCR_KEY_SECRET_KEY (optional) - The key in the Kubernetes secret containing the GCR key information. Default is '.keyjson'
* AWS_ACCESS_KEY (required) - The Kubernetes secret with the Amazon access key
* AWS_ACCESS_KEY_SECRET_KEY (optional) - The key in the Kubernetes secret with the Amazon access key. Default is 'aws-access-key'
* AWS_SECRET_KEY (required) - The Kubernetes secret with the Amazon secret key
* AWS_SECRET_KEY_SECRET_KEY (optional) - The key in the Kubernetes secret with the Amazon secret key. Default is 'aws-secret-key'
* AWS_REGION (required) - The Kubernetes secret with the Amazon region
* AWS_REGION_SECRET_KEY (optional) - The key in the Kubernetes secret with the Amazon region. Default is 'aws-region'
* DOCKER_CONFIG_FILE_PATH (required) - docker config json for authenticating to a registry (GCR, ECR, ACR not supported)
* DOCKER_CONFIG_SECRET (required) - The Kubernetes secret containing the docker config json information. Default is 'docker-registry'
* DOCKER_CONFIG_SECRET_KEY  (optional) - The key in the Kubernetes secret containing the docker config json information. Default is '.dockerconfigjson'
* DOCKER_USERNAME (required) - The Kubernetes secret with the docker username
* DOCKER_USERNAME_SECRET_KEY (optional) The key in the Kubernetes secret with the docker username. Default is 'username'
* DOCKER_PASSWORD (required) - The Kubernetes secret with the docker password
* DOCKER_PASSWORD_SECRET_KEY (optional) The key in the Kubernetes secret with the docker password. Default is 'password'
* USERNAME (required) - The Kubernetes secret with the standard registry username
* USERNAME_SECRET_KEY (optional) The key in the Kubernetes secret with the standard registry username. Default is 'username'
* PASSWORD (required) - The Kubernetes secret with the standard registry password
* PASSWORD_SECRET_KEY (optional) The key in the Kubernetes secret with the standard registry password. Default is 'password'
* DOMAIN (required) - The Kubernetes secret with the standard registry domain
* DOMAIN_SECRET_KEY (optional) - The key in the Kubernetes secret with the standard registry domain. Default is 'domain'
* AWS_ROLE_SECRET (required) - The Kubernetes secret with the Amazon role
* AWS_ROLE_SECRET_KEY (optional) -The key in the Kubernetes secret with the standard Amazon role. Default is 'role'

### Outputs
no outputs

## Examples

### task Example
```
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: report-image-info-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: report-image-info
        templateRef:
          name: argo-hub.codefresh-csdp.0.0.7
          template: report-image-info
        arguments:
          parameters:
          - name: IMAGE_URI
            value: 'docker.io/codefresh/cfstep-helm:lastest'
          - name: CF_API_KEY
            value: 'CODEFRESH_API_KEY'
          - name: GIT_REVISION
            value: 'a1bc234d56e78f9a0b12c34d5ef67fba89d01ea2
          - name: GIT_BRANCH
            value: 'main'
          - name: GIT_COMMIT_URL
            value: 'https://github.com/test/project/commit/a1bc234d56e78f9a0b12c34d5ef67fba89d01ea2'
          - name: GIT_COMMIT_MESSAGE
            value: "Merge branch 'test'"
          - name: GIT_SENDER_LOGIN
            value: "some-username"
          - name: DOCKER_USERNAME
            value: 'docker-username'
          - name: DOCKER_PASSWORD
            value: 'docker-password'
```
