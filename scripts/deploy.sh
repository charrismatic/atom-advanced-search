#!/bin/bash

BASE_DIR="$(npm prefix)"
BUILD_TIME="$(date +'%Y%m%d%H%M%S')"
DEPLOY_VERSION="$(node $BASE_DIR/lib/utilities/get_version.js)"

echo "DEPLOY_VERSION $DEPLOY_VERSION"

[[ ! -d .build ]] && mkdir .build

$BASE_DIR/run/clean
$BASE_DIR/run/sync-assets
$BASE_DIR/run/templates txt
$BASE_DIR/run/templates md
$BASE_DIR/run/templates html
$BASE_DIR/run/styles

mv .public ".build/$BUILD_TIME"

[[ ! -d .public ]] && mkdir .public
[[ ! -d .dist ]] && mkdir .dist
[[ ! -d .dist/$DEPLOY_VERSION ]] && mkdir ".dist/$DEPLOY_VERSION"
[[ -d .dist/$DEPLOY_VERSION ]] && find ".dist/$DEPLOY_VERSION" -type f -delete

mv ".build/$BUILD_TIME/assets" ".dist/$DEPLOY_VERSION/"
mv ".build/$BUILD_TIME/resume.md" ".dist/$DEPLOY_VERSION/"
mv ".build/$BUILD_TIME/resume.txt" ".dist/$DEPLOY_VERSION/"

js-beautify \
  --type html \
  --indent-size 2 \
  --no-preserve-newlines \
  --file ".build/$BUILD_TIME/index.html" \
  --outfile  ".dist/$DEPLOY_VERSION/index.html"

html-beautify \
  --type html \
  --indent-size 2  \
  --no-preserve-newlines \
  --wrap-attributes=preserve \
  --content_unformatted="style,script" \
  --extra_liners="" \
  --unformatted="style" \
  --file ".build/$BUILD_TIME/index.html" \
  --outfile  ".dist/$DEPLOY_VERSION/index.html"

google-chrome \
  --headless \
  --disable-gpu \
  --print-to-pdf "$BASE_DIR/.dist/$DEPLOY_VERSION/index.html"

mv ".build/$BUILD_TIME/assets" ".dist/$DEPLOY_VERSION/"

exit 0
