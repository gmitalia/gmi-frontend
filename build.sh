#!/bin/bash

# Exit on error
set -e

# Pass --maintenance flag to enable maintenance mode for gmicontest
if [ "$1" = "--maintenance" ]; then
    export NEXT_PUBLIC_MAINTENANCE_MODE=true
    echo "Root build: gmicontest will use MAINTENANCE MODE"
fi

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
