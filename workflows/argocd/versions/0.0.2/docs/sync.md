# sync

## Summary
Sync an application in ArgoCD. See `argocd app sync --help` with the ArgoCD CLI for flags

## Inputs/Outputs

### Inputs
* app - The app to sync (if syncing by label, use flags)
* flags - Any sync flags to set for the ArgoCD CLI
* serverUrl (required) - The address to reach ArgoCD (if in cluster, something like `argocd-server.<namespace>.svc.cluster.local`)
* opts - Global options for ArgoCd (ex. `--grpc-web`)
* tokenSecret - The Kubernetes secret holding the token for communicating with ArgoCD. Default is `argocd-token`
* tokenSecretKey - The key in the Kubernetes secret with the ArgoCD token. Default is `token`
* xtraceOption - Whether to enabled xtrace (echoing the command before running it) or not (`-o` and `+o` respectively). Default is "on" (`-o`)


### Outputs
No outputs

## Examples

### task Example
Minimal:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: argocd-sync-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: sync
        templateRef:
          name: argo-hub.argocd.0.0.2
          template: sync
        arguments:
          parameters:
          - name: app
            value: 'demo-app'
          - name: serverUrl
            value: 'argocd-server.argocd.svc.cluster.local'
```

With additional options
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: argocd-sync-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: sync
        templateRef:
          name: argo-hub.argocd.0.0.2
          template: sync
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
          - name: tokenSecret
            value: 'my-k8s-secret'
          - name: tokenSecretKey
            value: 'argocd-token'
```

Syncing via label instead of app name
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: argocd-sync-
spec:
  entrypoint: main
  templates:
  - name: main
    dag:
      tasks:
      - name: sync
        templateRef:
          name: argo-hub.argocd.0.0.2
          template: sync
        arguments:
          parameters:
          - name: flags
            value: '-l app.kubernetes.io/instance=my-app'
          - name: serverUrl
            value: 'argocd-server.argocd.svc.cluster.local'
          - name: opts
            value: '--grpc-web'
          - name: tokenSecret
            value: 'my-k8s-secret'
          - name: tokenSecretKey
            value: 'argocd-token'
```