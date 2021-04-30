#!/bin/bash

# Copyright (c) 2020 - 2021 The Pegabot authors
# This code is licensed under GNU Affero General Public License v3.0
# (see https://github.com/pegabot/discord/blob/main/LICENSE for details)

BUILD=$(git rev-parse --short HEAD)

file="src/constants/build.ts"

trim() {
    local var="$*"
    # remove leading whitespace characters
    var="${var#"${var%%[![:space:]]*}"}"
    # remove trailing whitespace characters
    var="${var%"${var##*[![:space:]]}"}"   
    printf '%s' "$var"
}

if [ -f $file ]
then
  rm $file;
fi

echo "export const build = '$(trim $BUILD)';"  > $file
