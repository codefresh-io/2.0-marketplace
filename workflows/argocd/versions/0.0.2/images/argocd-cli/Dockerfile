FROM alpine:3.19.0

ARG ARGOCD_CLI_VERSION=v2.10.0

RUN apk update \
  && apk add --no-cache \
    jq \
  && wget -O /usr/local/bin/argocd https://github.com/argoproj/argo-cd/releases/download/$ARGOCD_CLI_VERSION/argocd-linux-amd64 \
  && chmod +x /usr/local/bin/argocd
