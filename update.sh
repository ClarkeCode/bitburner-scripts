#!/bin/sh
ZIP_NAME=bitburnerScripts.zip
DESTINATION=./scripts/
FULL_FILE="$DESTINATION""$ZIP_NAME"


rm -rf ./*.txt
find . -name "*.ns" -type f -delete
sh ./move-from-downloads.sh

[[ -f "$ZIP_NAME" ]] && mkdir --parents "$DESTINATION" && mv "$ZIP_NAME" $_;
[[ -f "$FULL_FILE" ]] && unzip "$FULL_FILE" -d "$DESTINATION"
rm -f "$FULL_FILE"
