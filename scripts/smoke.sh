#!/usr/bin/env bash
set -euo pipefail
base="${1:-http://127.0.0.1:8787}"
call() {
  curl --fail-with-body --silent --show-error --max-time 10 "$base/mcp" -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' --data "$1"
  echo
}
call '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"smoke","version":"1"}}}'
call '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
call '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"check_car_listing","arguments":{"title":"Volkswagen Golf 1.5 TSI Automatic","photo_count":4}}}'
