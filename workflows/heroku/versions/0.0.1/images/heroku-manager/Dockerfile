FROM alpine:latest
RUN apk --update add curl bash nodejs npm git
RUN curl https://cli-assets.heroku.com/install.sh | sh
ENTRYPOINT heroku