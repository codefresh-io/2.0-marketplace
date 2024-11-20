# heroku-deployer

## Summary
Sends a code scan report to codecov

## Inputs/Outputs

### Inputs
* HEROKU_SECRET (required) - The Kubernetes secret with the Heroku login details
* HEROKU_API_TOKEN_SECRET_KEY (optional) - The key in the Kubernetes secret with the Heroku api token. Default is 'token'
* HEROKU_EMAIL_SECRET_KEY (optional) - The key in the Kubernetes secret with the Heroku login email. Default is 'email'
* APP_NAME (required) - Name of application
* WORKING_DIRECTORY (optional) - Path to working directory within cloned repository. Default is '.'.
* REPO_URL (required) - Git repo to be run containing sonar-project.properties. Key defaults to token.
* GIT_TOKEN (optional) - the k8s secret name that contains a key named token with the git secret inside it
* REPO (required) - Path to artifact where repository is to be cloned.

### Secrets
* Heroku Secret - in order for this template to work a secret named `heroku-secret` must exist with heroku login details.
```
    apiVersion: v1
    kind: Secret
    metadata:
        name: heroku-secret
    type: Opaque
    data:
        token: echo -n 'heroku api token' | base64
        email: echo -n 'heroku email' | base64
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
  generateName: heroku-deployer-
spec:
    entrypoint: main
    templates:
    -   name: main
        dag:
            tasks:
            -   name: clone-step
                templateRef:
                    name: argo-hub.git.0.0.2
                    template: clone
                arguments:
                    parameters:
                    -   name: REPO_URL
                        value: 'https://github.com/codefresh-io/argo-hub'
                    -   name: GIT_TOKEN_SECRET
                        value: 'git-token-name'
                outputs:
                    artifacts:
                    -   name: REPO
                        path: '/tmp/repo'
            -   name: heroku-deployer
                depends: clone-step
                templateref:
                    name: argo-hub.heroku.0.0.1
                    template: heroku-deployer
                arguments:
                    artifacts:
                    -   name: REPO
                        from: "{{tasks.clone-step.outputs.artifacts.repo}}"
                    parameters:
                    -   name: HEROKU_SECRET
                        value: heroku-secret
                    -   name: APP_NAME
                        value: codefresh-test
```
