# image-enricher-git-info

## Summary
Enrich images with metadata and annotation such as PR, commits, committers.

## Inputs/Outputs

### Inputs
* IMAGE (required) - The image URI that was imported into Codefresh to enrich
* BRANCH (required) - The git branch to use to enrich
* REPO (required) - The GitHub repo to use to enrich
* CF_API_KEY (required) - The Kubernetes secret containing the Codefresh API key
* CF_API_KEY_SECRET_KEY (optional) - The key in the Kubernetes secret that has the Codefresh API Key. Default is 'token'
* CF_URL (optional) - The URL to reach Codefresh (support on-premises Codefresh). Default is 'codefresh.io'
* GITHUB_HOST (optional) - The URL to reach GitHub (support on-premises GitHub host). Default is 'github.com'
* GITHUB_API (optional) - The URL to reach the GitHub API (support on-premises GitHub api).
* API_PATH_PREFIX (optional) - The API prefix path for GitHub (support on-premises GitHub path prefix).
* GITHUB_TOKEN (optional) - The Kubernetes secret containing the GitHub token
* GITHUB_TOKEN_SECRET_KEY (optional) - The key in the Kubernetes secret containing the GitHub token. Default is 'token'


### Outputs
no outputs

## Examples

### task Example
```
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: image-enricher-git-info-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: image-enricher-git-info
        templateRef:
          name: argo-hub.codefresh-csdp.0.0.7
          template: image-enricher-git-info
        arguments:
          parameters:
          - name: IMAGE
            value: 'gcr.io/codefresh/cfstep-helm:lastest'
          - name: BRANCH
            value: 'main'
          - name: REPO
            value: 'codefresh/cfstep-helm'
          - name: CF_API_KEY
            value: 'CODEFRESH_API_KEY'
          - name: GITHUB_TOKEN
            value: 'GITHUB_TOKEN'
```
