#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
open -n "$DIR/NH Reader.app" --args "$@"
