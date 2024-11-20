# list

## Summary
List applications in ArgoCD and store the output as a workflow output. See `argocd app list --help` with the ArgoCD CLI for flags

## Inputs/Outputs

### Inputs
* flags - Any list flags to set for the ArgoCD CLI
* serverUrl (required) - The address to reach ArgoCD (if in cluster, something like `argocd-server.<namespace>.svc.cluster.local`)
* opts - Global options for ArgoCd (ex. `--grpc-web`)
* listId (required) - The ID to roll back to
* tokenSecret - The Kubernetes secret holding the token for communicating with ArgoCD. Default is `argocd-token`
* tokenSecretKey - The key in the Kubernetes secret with the ArgoCD token. Default is `token`
* xtraceOption - Whether to enabled xtrace (echoing the command before running it) or not (`-o` and `+o` respectively). Default is "on" (`-o`)



### Outputs
* apps - A file with the results of the `argocd app list` command run

## Examples

### task Example
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: argocd-list-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: list
        templateRef:
          name: argo-hub.argocd.0.0.2
          template: list
        arguments:
          parameters:
          - name: app
            value: 'demo-app'
          - name: flags
            value: '--output name'
          - name: serverUrl
            value: 'argocd-server.argocd.svc.cluster.local'
          - name: opts
            value: '--grpc-web'
          - name: listId
            value: 1
          - name: tokenSecret
            value: 'my-k8s-secret'
          - name: tokenSecretKey
            value: 'argocd-token'
```