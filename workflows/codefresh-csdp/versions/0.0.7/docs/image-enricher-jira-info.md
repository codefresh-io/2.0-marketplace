# image-enricher-jira-info

## Summary
Enrich images with metadata and annotation such as ticket number, title, assignee, status.

## Inputs/Outputs

### Inputs
* IMAGE (required) - The image URI that was imported into Codefresh to enrich
* JIRA_HOST (required) - jira host, should be without protocol and / in the end.
* JIRA_CONTEXT (optional) - The Jira context to use
* JIRA_API_TOKEN_SECRET (required) - Name of Kubernetes secret that contains a jira email and token that you generate in jira
* JIRA_API_TOKEN_SECRET_KEY (required) - The key in the Kubernetes secret with the Jira API token. Default is 'token'
* JIRA_EMAIL_SECRET_KEY (required) - The key in the Kubernetes secret with the Jira Email associated with the API token. Default is 'email'
* JIRA_PROJECT_PREFIX (required) - jira project prefix like: SAAS, CF, etc
* CF_API_KEY (required) - The Kubernetes secret containing the Codefresh API key
* CF_API_KEY_SECRET_KEY (optional) - The key in the Kubernetes secret that has the Codefresh API Key. Default is 'token'
* CF_URL (optional) - The URL to reach Codefresh (support on-premises Codefresh). Default is 'codefresh.io'
* MESSAGE (required) - message from which you want retrieve issue name, can be a branch, commit message, whatever
* FAIL_ON_NOT_FOUND (optional) - fail in case of ticket not found. Default is 'false'

### Outputs
no outputs

## Examples

### task Example
```
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: image-enricher-jira-info-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: image-enricher-jira-info
        templateRef:
          name: argo-hub.codefresh-csdp.0.0.7
          template: image-enricher-jira-info
        arguments:
          parameters:
          - name: IMAGE
            value: 'gcr.io/codefresh/cfstep-helm:lastest'
          - name: JIRA_PROJECT_PREFIX
            value: 'JR'
          - name: MESSAGE
            value: 'JR-1234'
          - name: JIRA_HOST
            value: 'jira.atlassian.net'
          - name: JIRA_API_TOKEN_SECRET
            value: 'jira-credentials'
          - name: CF_API_KEY
            value: 'CODEFRESH_API_KEY'
```
