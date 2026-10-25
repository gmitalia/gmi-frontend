#!/bin/bash

# Exit on error
set -e

# Pass --maintenance flag to enable maintenance mode for the competitions section
if [ "$1" = "--maintenance" ]; then
    export NEXT_PUBLIC_MAINTENANCE_MODE=true
    echo "Root build: competizioni in MAINTENANCE MODE"
fi

# Pulisce l'output precedente per evitare file rimasti da build vecchie
rm -rf public
mkdir -p public

# Blog e competizioni vivono in un'unica app Next (packages/portal).
# L'export statico contiene già le competizioni sotto /competizioni.
cd packages/portal
npm run build
cd out
cp -r . ../../../public
cd ../../..
