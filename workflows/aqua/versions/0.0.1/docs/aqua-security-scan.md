# aqua-security-scan

## Summary
Execute an Aqua container security scan.

## Inputs/Outputs

### Inputs
* AQUA_HOST (required) - Aqua Host URI including protocol ex. https://aqua.mydomain.com
* AQUA_SECRET (required) - The Kubernetes secret with Aqua log in credentials
* AQUA_PASSWORD (optional) - The key in the Kubernetes secret with the Aqua password. Default is 'password'
* AQUA_USERNAME (optional) - The key in the Kubernetes secret with the Aqua username. Default is 'username'
* AQUA_TOKEN (optional) - The key in the Kubernetes secret with the Aqua scanner token. A unique token generated for each scanner while adding a scanner daemon from the Administration > Scanners page. Default is 'token'
* IMAGE (required) - Image Name
* REGISTRY (required) - Name of registry that holds the image
* TAG (optional) - Image Tag. Default is 'latest'

### Secrets
* Aqua Secret - in order for this template to work a secret named `aqua-secret` must exist with aqua token.
```
    apiVersion: v1
    kind: Secret
    metadata:
        name: aqua-secret
    type: Opaque
    data:
        token: echo -n 'aqua scanner token' | base64
        username: echo -n 'aqua username' | base64
        password: echo -n 'aqua password' | base64
```

### Outputs
no outputs

## Examples

### task Example
```
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: aqua-security-scan-
spec:
    entrypoint: main
    templates:
    -   name: main
        dag:
            tasks:
            -   name: aqua-security-scan
                templateRef:
                    name: argo-hub.aqua.0.0.1
                    template: aqua-security-scan
                arguments:
                    parameters:
                    -   name: AQUA_HOST
                        value: 'https://aqua.mydomain.com'
                    -   name: AQUA_SECRET
                        value: 'aqua-secret'
                    -   name: IMAGE
                        value: 'image'
                    -   name: REGISTRY
                        value: 'dockerhub'
```
