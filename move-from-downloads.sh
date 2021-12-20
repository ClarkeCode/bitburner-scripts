#!/bin/sh

#NOTE: This file is excluded by the .gitignore, so your user directory
#      will not be included in your commits
#
#To have git ignore an already-commited file:
#      Run git update-index --assume-unchanged move-from-downloads.sh
#      If this file appears in 'git status' after changing the DL_PATH
DL_PATH=/c/Users/<Your User Goes Here>/Downloads/
FILE_PATH="$DL_PATH"bitburnerScripts.zip
[[ -f "$FILE_PATH" ]] && mv "$FILE_PATH" .
