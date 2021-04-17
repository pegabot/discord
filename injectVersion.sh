#!/bin/bash

# Copyright (c) 2020 - 2021 The Pegabot authors
# This code is licensed under MIT license (see LICENSE for details)

file="src/utils/version.ts"

if [ -f $file ]
then
  rm $file;
fi

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

echo "export const version = '$PACKAGE_VERSION';"  > $file
