# rollback

## Summary
Rollback an application in ArgoCD. See `argocd app rollback --help` with the ArgoCD CLI for flags

## Inputs/Outputs

### Inputs
* app - The app to rollback
* flags - Any rollback flags to set for the ArgoCD CLI
* serverUrl (required) - The address to reach ArgoCD (if in cluster, something like `argocd-server.<namespace>.svc.cluster.local`)
* opts - Global options for ArgoCd (ex. `--grpc-web`)
* rollbackId (required) - The ID to roll back to
* tokenSecret - The Kubernetes secret holding the token for communicating with ArgoCD. Default is `argocd-token`
* tokenSecretKey - The key in the Kubernetes secret with the ArgoCD token. Default is `token`
* xtraceOption - Whether to enabled xtrace (echoing the command before running it) or not (`-o` and `+o` respectively). Default is "on" (`-o`)



### Outputs
No outputs

## Examples

### task Example
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: argocd-rollback-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: rollback
        templateRef:
          name: argo-hub.argocd.0.0.2
          template: rollback
        arguments:
          parameters:
          - name: app
            value: 'demo-app'
          - name: flags
            value: '--prune --timeout 30'
          - name: serverUrl
            value: 'argocd-server.argocd.svc.cluster.local'
          - name: opts
            value: '--grpc-web'
          - name: rollbackId
            value: 1
          - name: tokenSecret
            value: 'my-k8s-secret'
          - name: tokenSecretKey
            value: 'argocd-token'
```