#!/bin/sh

#NOTE: This file is excluded by the .gitignore, so your user directory
#      will not be included in your commits
DL_PATH=/c/Users/<Your User Goes Here>/Downloads/
FILE_PATH="$DL_PATH"bitburnerScripts.zip
[[ -f "$FILE_PATH" ]] && mv "$FILE_PATH" .
