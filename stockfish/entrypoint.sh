#!/usr/bin/env sh

set -e

ssh-keygen -A >/dev/null

if ! echo "$1" | grep -q 'supervisor'; then
  /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
fi

exec "$@"
