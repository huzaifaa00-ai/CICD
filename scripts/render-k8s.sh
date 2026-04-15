#!/usr/bin/env sh
set -eu

IMAGE_REPO="${1:-ravipratapsingh14/cicd-demo-app}"
IMAGE_TAG="${2:-latest}"

sed -e "s|IMAGE_PLACEHOLDER|${IMAGE_REPO}:${IMAGE_TAG}|g" \
  -e "s|APP_VERSION_PLACEHOLDER|${IMAGE_TAG}|g" \
  k8s/deployment.yaml
