#!/usr/bin/env bash
set -euo pipefail

curl -X POST https://head.auto-airbds.pages.dev/api/upload \
  -H "Content-Type: application/json" \
  -H "X-API-Key: auto-airbds-dev-key" \
  -d '{"name":"test","value":123,"tags":["a","b","c"]}'
