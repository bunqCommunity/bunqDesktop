#!/usr/bin/env bash
echo " - Ensure releases directory exists"
mkdir -p dist/releases

echo " - Attempt to move dist files to separate directory"
mv  dist/bunqDesktop-*.exe \
    dist/bunqDesktop-*.dmg \
    dist/bunqDesktop-*.deb \
    dist/bunqDesktop-*.snap \
    dist/bunqDesktop-*.AppImage \
    dist/bunqDesktop-linux-unpacked.tar.gz \
    dist/CHECKSUMS*.sha256 \
    -t dist/releases/

echo " - Modify the existing snapshot release title and description"
SNAPSHOT_RELEASE_ID=$(curl 'https://api.github.com/repos/bunqCommunity/bunqDesktop/releases/tags/snapshot' -u Crecket:$GITHUB_TOKEN | jq '.id')

echo " - Modify the existing snapshot release title and description"
curl --request PATCH https://api.github.com/repos/bunqCommunity/bunqDesktop/releases/$SNAPSHOT_RELEASE_ID \
    -u Crecket:$GITHUB_TOKEN \
    --data "{\"body\": \"Automatic bunqDesktop development build of $TRAVIS_BRANCH ($TRAVIS_COMMIT) built by Travis CI on $(date +'%F %T').\", \"name\": \"Nightly build $(date +'%F %T')\"}"

echo " - Begin upload to Github using ghr"
ghr -t $GITHUB_TOKEN -replace -prerelease snapshot 'dist/releases/'
