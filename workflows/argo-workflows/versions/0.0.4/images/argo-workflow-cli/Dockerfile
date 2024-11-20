FROM alpine:3.15.0

ARG ARGO_WORKFLOWS_CLI_VERSION=v3.5.4
ARG TARGETARCH

RUN wget https://github.com/argoproj/argo-workflows/releases/download/$ARGO_WORKFLOWS_CLI_VERSION/argo-linux-${TARGETARCH}.gz \
    && gunzip argo-linux-${TARGETARCH}.gz \
    && chmod +x argo-linux-${TARGETARCH} \
    && mv ./argo-linux-${TARGETARCH} /usr/local/bin/argo
