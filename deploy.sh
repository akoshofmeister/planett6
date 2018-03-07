#!/bin/bash
# Magic deploy script

echo "Zipping /dist"
zip -r planett6.zip dist

echo "Uploading zip to server"
curl --form "fileupload=@planett6.zip" --form secret=$DEPLOY_SECRET_KEY $DEPLOY_ADDRESS
