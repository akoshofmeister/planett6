#!/bin/bash
# Magic deploy script
zip planett6.zip dist
curl -F 'data=@planett6.zip;secret=${DEPLOY_SECRET_KEY}' DEPLOY_ADDRESS
