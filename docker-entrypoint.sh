#!/bin/sh
set -eu

CONFIG_VARS='${VITE_ENVIRONMENT}
${VITE_ACCESSIBILITY_STATEMENT_URL}'

VERSION_VARS='${VITE_BUILD_NUMBER}
${VITE_MAJOR_MINOR_VERSION_MASTER}
${VITE_MAJOR_MINOR_VERSION_DEVELOPMENT}'

if [ -f /etc/app-config/config.js ]; then
    cp /etc/app-config/config.js /tmp/config.js
else
    envsubst "$CONFIG_VARS" < /usr/share/nginx/html/config.template.js > /tmp/config.js
fi

envsubst "$VERSION_VARS" < /usr/share/nginx/html/version.template.js > /tmp/version.js

exec nginx -g 'daemon off;'
