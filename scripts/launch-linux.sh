#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
chmod +x "$DIR/nh-reader-linux" 2>/dev/null || true
exec "$DIR/nh-reader-linux" "$@"
