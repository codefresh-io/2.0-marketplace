# run-pipeline

## Summary
A wrapper on top of Codefresh cli run operation.

The template provides the easy ability to trigger pipelines.

## Inputs/Outputs

### Inputs
* CF_API_KEY_SECRET (required) - K8s secret name that contains a key named `token` with codefresh [api key](https://codefresh.io/docs/docs/integrations/codefresh-api/#authentication-instructions).
* PIPELINE_NAME (required) - Pipeline name
* TRIGGER_NAME (required) - Trigger name
* CF_BRANCH (required) - Branch name
* EXTRA_OPTIONS (optional) - Additional cli flags
* VARIABLES (optional) - Variables to pass to the build

### Outputs
no outputs

## Examples

### Submit a basic workflow
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: codefresh-classic-run-pipeline-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: hello-world
        templateRef:
          name: argo-hub.codefresh-classic.0.0.2
          template: run-pipeline
        arguments:
          parameters:
            - name: CF_API_KEY_SECRET
              value: codefresh-v1-api-token
            - name: PIPELINE_NAME
              value: pipeline-name
            - name: TRIGGER_NAME
              value: trigger-name
            - name: CF_BRANCH
              value: main
```
