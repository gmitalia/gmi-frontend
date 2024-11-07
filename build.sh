#!/bin/bash

# Exit on error
set -e

mkdir -p public

# blog
cd packages/blog
npm run export
cd ./out
cp -r . ../../../public
cd ../../..

# gmicontest
cd packages/gmicontest
npm run build && npm run export
mv out competizioni
cp -r ./competizioni ../../public
rm -rf competizioni


