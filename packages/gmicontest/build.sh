# Pass --maintenance flag to enable maintenance mode
if [ "$1" = "--maintenance" ]; then
    export NEXT_PUBLIC_MAINTENANCE_MODE=true
    echo "Building in MAINTENANCE MODE"
fi

npm run build && npm run export
mv out competizioni
cp -r ./competizioni ../../public
rm -rf competizioni
