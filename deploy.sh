#!/bin/bash
# Magic deploy script

echo "Zipping /dist"
zip -r planett6.zip dist server/dist

echo "Uploading zip to server"
curl --form "fileupload=@planett6.zip" --form secret=$DEPLOY_SECRET_KEY --form server=1 $DEPLOY_ADDRESS
