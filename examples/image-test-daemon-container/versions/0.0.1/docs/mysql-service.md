# mysl-service

## Summary
this is the template used to demo the usage of a [daemon container](https://argoproj.github.io/argo-workflows/walk-through/daemon-containers/). It is typically used to run a sidecar container to offer additional service. The most common scenario is launching services such as databases in order to accommodate integration tests.

## Inputs/Outputs

### Inputs

* MYSQL_SECRET - see Secrets below
* MYSQL_DATABASE (required) - name of mysql database
* MYSQL_HOST (required) - mysql host name

### Volumes

No Volumes

### Secrets

* MYSQL Secret - in order for this template to work a secret named `mysql-secret` must exist with mysql login information.
```
    apiVersion: v1
    kind: Secret
    metadata:
        name: mysql-secret
    type: Opaque
    data:
        root-password: echo -n 'mysql root password' | base64
        user: echo -n 'mysql user' | base64
        password: echo -n 'mysql password' | base64
```

### Outputs
no outputs
