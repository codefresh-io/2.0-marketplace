# wait

## Summary
Wait for an application in ArgoCD. See `argocd app wait --help` with the ArgoCD CLI for flags

## Inputs/Outputs

### Inputs
* app - The app to wait for (if waiting by label, use flags)
* flags - Any wait flags to set for the ArgoCD CLI
* serverUrl (required) - The address to reach ArgoCD (if in cluster, something like `argocd-server.<namespace>.svc.cluster.local`)
* opts - Global options for ArgoCd (ex. `--grpc-web`)
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
  generateName: argocd-wait-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: wait
        templateRef:
          name: argo-hub.argocd.0.0.2
          template: wait
        arguments:
          parameters:
          - name: app
            value: 'demo-app'
          - name: flags
            value: '--health'
          - name: serverUrl
            value: 'argocd-server.argocd.svc.cluster.local'
          - name: opts
            value: '--grpc-web'
          - name: tokenSecret
            value: 'my-k8s-secret'
          - name: tokenSecretKey
            value: 'argocd-token'
```