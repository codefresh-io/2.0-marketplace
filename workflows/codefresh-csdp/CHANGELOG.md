# Changelog 

## v1.1.11 (17.10.2024)
### report-image-info
* Add multi-arch image support.

## v1.1.10 (16.06.2023)
### image-enricher-git-info
* Add gerrit support.

## v1.1.9 (1.06.2023)
### image-enricher-git-info
* Changed annotation key to avoid PR collision.

## v1.1.9 (22.03.2023)
* Allow to use regular expressions or multiple project prefixes separated by comma in JIRA_PROJECT_PREFIX.

## v1.1.8 (22.03.2023)
* Add GOOGLE_REGISTRY_HOST and GOOGLE_JSON_KEY to report-image-info
 
## v1.1.8 (28.02.2023)
* Using @codefresh-io/cf-report-image-toolbox library
* Adding commit sha as `revision` input

## v1.1.7 (16.01.2023)
### report-image-info
* Save Dockerfile and Layers to image info

## v1.1.6 (13.01.2023)
### image-enricher-git-info
* Deprecated usage of image SHA

## v1.1.6 (13.1.2022)
### image-enricher-git-info
* Deprecated usage of image SHA

## v1.1.5 (21.12.2022)
### image-enricher-jira-info
* Add ability to use personal access token for Jira Server

## v1.1.4 (20.12.2022)
### report-image-info
* Handle redirects correctly when interacting with the standard container registries
* Used @aws-sdk v3 library

### image-enricher-git-info
* Support personal bitbucket server repos

## v1.1.3 (15.8.2022)
### report-image-info
* Added new output param `image_link` to the image in codefresh.

## v1.1.2 (13.7.2022)
### image-enricher-git-info
* Fix workflow name not being applied to the image binary.
* Changed the way git revision information retrieved. If branch was deleted we couldn't retrieve git data, so now git date taken from the PR commits.

## v1.1.1 (13.7.2022)

Add bitbucket support to image-enricher-git-info plugin

## v1.1.0 (28.6.2022)

Refactor. Added new output param `exit_error` to all templates that stores the error message in case template execution failed.

## v1.0.1 (20.6.2022)

Updated all images to be based on debian distro to avoid DNS issues found on alpine

## v0.0.6 (13.5.2022)

### image-enricher-git-info
Add gitlab support to image-enricher-git-info plugin

## v0.0.6 (8.4.2022)

### report-image-info
Add WORKFLOW_URL and LOGS_URL to report-image-info

## v0.0.6 (29.03.2022)

### image-enricher-git-info
Added information about commits to the image

## v0.0.7 (29.03.2022)

### image-enricher-git-info
Added information about commits to the image

## v0.0.6 (14.2.2022)

### report-image-info
Add DOCKER_CONFIG_FILE_PATH, DOCKER_CONFIG_SECRET to authenticate registry using docker config json

## v0.0.6 (25.1.2022)

Changed icon and rename to CSDP-metadata

## v0.0.6 (12.1.2022)

### report-image-info
Added AWS_ROLE_SECRET to retrieve credentials for ECR using STS

## v0.0.6 (7.1.2022)

### image-enricher-jira-info
Add additional variables to allow users to select the keys in the secrets they are referencing

### image-enricher-git-info 
Add additional variables to allow users to select the keys in the secrets they are referencing

### report-image-info
Add additional variables to allow users to select the keys in the secrets they are referencing

## v0.0.5 (3.1.2022)

### report-image-info

Added volume for gcr key file
All registry secrets parameters were set to optional

## v0.0.4 (30.12.2021)

### image-enricher-jira-info

Enrich images with jira avatarURL

### report-image-info

Default value for secret parameters was removed
Added parameters validation

## v0.0.3 (21.12.2021)

### report-image-info

Report image info to argo platform.

## v0.0.2 (20.12.2021)

### image-enricher-git-info

Enrich images with metadata and annotation such as PR, commits, committers

### image-enricher-jira-info

Enrich images with metadata and annotation such as ticket number, title, assignee, status

## v0.0.1 (14.12.2021)

### image-enricher-git

Enrich codefresh image with PRs and Issues info. Adds pull request information to an image.
