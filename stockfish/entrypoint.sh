#!/usr/bin/env sh

set -e

ssh-keygen -A >/dev/null

tcpserver -c2 0 23249 stockfish &

if [ $# -eq 0 ]; then
  /usr/sbin/sshd -D -e
else
  /usr/sbin/sshd &
  exec "$@"
fi
