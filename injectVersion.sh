#!/bin/bash

# Copyright (c) 2020 - 2021 The Pegabot authors
# This code is licensed under GNU Affero General Public License v3.0
# (see https://github.com/pegabot/discord/blob/main/LICENSE for details)


PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

if [ $PACKAGE_VERSION = "x.y.z" ];
then
  exit;
fi

trim() {
    local var="$*"
    # remove leading whitespace characters
    var="${var#"${var%%[![:space:]]*}"}"
    # remove trailing whitespace characters
    var="${var%"${var##*[![:space:]]}"}"   
    printf '%s' "$var"
}

file="src/constants/version.ts"

if [ -f $file ]
then
  rm $file;
fi

echo "export const version: string = '$(trim $PACKAGE_VERSION)';"  > $file
