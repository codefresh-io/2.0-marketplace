# image-test-daemon-container

## Summary
This Workflow Template is used to create a pipeline that takes a source repository and creates an image through Kaniko. Using that image, a service container is set up and the image is tested using the service container. This example runs nodejs on a mysql server. Template based off https://codefresh.io/docs/docs/yaml-examples/examples/integration-tests-with-mysql/#the-example-nodejs-project.

## Inputs/Outputs

### Inputs
* REPO (required) - The github repository you want to clone that holds the source code (for example: https://github.com/codefresh-io/cli-v2)
* IMAGE_NAME (required) - The image name to give to the built image
* MYSQL_DATABASE (required) - name of mysql database
* MYSQL_HOST (required) - mysql host name


### Volumes
* docker-config - in order for this template to work a volume named `docker-config` must exist with DOCKER_CONFIG_SECRET name.
```
  volumes:
    - name: docker-config
      secret:
        items:
          - key: .dockerconfigjson
            path: config.json
        secretName: '{{ inputs.parameters.DOCKER_CONFIG_SECRET }}'
```

### Secrets
* MYSQL Secret - in order for this template to work a secret named `mysql-secret` must exist with mysql login information.
```
    apiVersion: v1
    kind: Secret
    metadata:
        name: mysql-secret
    type: Opaque
    data:
        root-password: echo -n 'mysql root password' | base64
        user: echo -n 'mysql user' | base64
        password: echo -n 'mysql password' | base64
```

* Github Secret - in order for this template to work a secret named `github-token` must exist with a github token.
```
    apiVersion: v1
    kind: Secret
    metadata:
        name: github-token
    type: Opaque
    data:
        token: echo -n 'github token' | base64
```

### Outputs
no outputs

## Examples

### task Example
```
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: image-test-daemon-container-
spec:
  entrypoint: image-test-daemon-container
  volumes:
  - name: docker-config
    secret:
      items:
      - key: .dockerconfigjson
        path: config.json
      secretName: 'docker-config'
  templates:
  - name: image-test-daemon-container
    dag:
      tasks:
      - name: image-test-daemon-container
        templateRef:
          name: argo-hub.image-test-daemon-container.0.0.1
          template: image-test-daemon-container
        arguments:
          parameters:
          - name: REPO
            value: 'https://github.com/codefreshdemo/cf-example-unit-tests-with-composition'
          - name: IMAGE_NAME
            value: 'mysql-tests'
          - name: MYSQL_DATABASE
            value: nodejs
          - name: MYSQL_HOST
            value: test_mysql_db
```
