#!/bin/bash

# Copyright (c) 2020 - 2021 The Pegabot authors
# This code is licensed under GNU Affero General Public License v3.0
# (see https://github.com/pegabot/discord/blob/main/LICENSE for details)

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

build=$(git rev-parse --short HEAD)

echo "export const version: String = '$(trim $build)';"  > $file;

git add .;
git commit -m "Adding commit id as version";