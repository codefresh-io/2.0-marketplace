# history

## Summary
Get an applications history in ArgoCD and store the output as a workflow output. See `argocd app history --help` with the ArgoCD CLI for flags

## Inputs/Outputs

### Inputs
* app - The app to get history from
* flags - Any history flags to set for the ArgoCD CLI (i.e. output format)
* serverUrl (required) - The address to reach ArgoCD (if in cluster, something like `argocd-server.<namespace>.svc.cluster.local`)
* opts - Global options for ArgoCd (ex. `--grpc-web`)
* historyId (required) - The ID to roll back to
* tokenSecret - The Kubernetes secret holding the token for communicating with ArgoCD. Default is `argocd-token`
* tokenSecretKey - The key in the Kubernetes secret with the ArgoCD token. Default is `token`
* xtraceOption - Whether to enabled xtrace (echoing the command before running it) or not (`-o` and `+o` respectively). Default is "on" (`-o`)



### Outputs
* history - A file with the results of the `argocd app history` command run

## Examples

### task Example
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: argocd-history-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: history
        templateRef:
          name: argo-hub.argocd.0.0.2
          template: history
        arguments:
          parameters:
          - name: app
            value: 'demo-app'
          - name: flags
            value: '--output id'
          - name: serverUrl
            value: 'argocd-server.argocd.svc.cluster.local'
          - name: opts
            value: '--grpc-web'
          - name: historyId
            value: 1
          - name: tokenSecret
            value: 'my-k8s-secret'
          - name: tokenSecretKey
            value: 'argocd-token'
```