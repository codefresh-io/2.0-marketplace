# run-pipeline

## Summary
A wrapper on top of Codefresh cli [synchronize teams](https://codefresh-io.github.io/cli/teams/synchronize-teams/) operation.

The template provides the easy ability to sync teams and can be run in a scheduled job.

## Inputs/Outputs

### Inputs
* CF_API_KEY_SECRET (required) - K8s secret name that contains a key named `token` with codefresh [api key](https://codefresh.io/docs/docs/integrations/codefresh-api/#authentication-instructions).
* PIPELINE_NAME (required) - Pipeline name
* TRIGGER_NAME (required) - Trigger name
* CF_BRANCH (required) - Branch name
* EXTRA_OPTIONS (optional) - Additional cli flags
* VARIABLES (optional) - Variables to pass to the build

* GIT_TOKEN_SECRET (optional) - The secret with the token to synchronize a GitHub team with. value is `autopilot-secret`
* GIT_TOKEN_SECRET_KEY (optional) - They key in the `GIT_TOKEN_SECRET` secret that has the GitHub token. value is `git_token`.
* CF_V1_TOKEN_SECRET (required) - The secret with the codefresh token for API communication. value is `codefresh-v1-token`
* CF_V1_TOKEN_SECRET_KEY (required) - They key in the `CF_V1_TOKEN_SECRET` secret with the codefresh token for API communication. value is `token`
* CLIENT_NAME (required) - The name of the team in codefresh that we are syncing .value is `my-team`
* CLIENT_TYPE (required) - The type of team to sync (github, okta, or azure) value is `github`
* OPTIONAL_PARAMS (optional) - Any optional parameters for the sync command (i.e. `--disable-notifications`). value is empty

### Outputs
no outputs

## Examples

### Submit a basic workflow
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: codefresh-classic-synchronize-teams-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: sync-my-team
        templateRef:
          name: argo-hub.codefresh-classic.0.0.2
          template: sync-team
        arguments:
          parameters:
            - name: GIT_TOKEN_SECRET
              value: 'autopilot-secret'
            - name: GIT_TOKEN_SECRET_KEY
              value: 'git_token'
            - name: CF_V1_TOKEN_SECRET
              value: 'codefresh-v1-token'
            - name: CF_V1_TOKEN_SECRET_KEY
              value: 'token'
            - name: CLIENT_NAME
              value: my-team
            - name: CLIENT_TYPE
              value: github # github, okta, azure
            - name: OPTIONAL_PARAMS
              value: "--disable-notifications"
```
