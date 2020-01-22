#!/usr/bin/env bash
cd "$(dirname "$0")"
docker run --rm \
  --env-file <(env | grep -v '\r' | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|(\b(?!TRAVIS_COMMIT_MESSAGE)TRAVIS)|APPVEYOR_|CSC_|_TOKEN|_KEY|BUILD_') \
  -v ${TRAVIS_BUILD_DIR}:/project \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  $(docker build -q .) \
  /bin/bash -c 'yarn --link-duplicates --pure-lockfile && yarn run release --linux'
