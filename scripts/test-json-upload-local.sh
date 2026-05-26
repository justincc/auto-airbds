#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
URL="http://localhost:8788/api/upload"

# Capture the response body and append the HTTP status code on the final line.
response="$(curl -sS -X POST "$URL" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: auto-airbds-dev-key" \
  --data-binary "@${SCRIPT_DIR}/example-assessment-1.json" \
  -w $'\n%{http_code}')"

status="${response##*$'\n'}"
body="${response%$'\n'*}"

if [[ "$status" =~ ^2 ]]; then
  echo "Upload succeeded (HTTP $status)."
  if id="$(printf '%s' "$body" | grep -o '"id":"[^"]*"' | head -n1 | cut -d'"' -f4)" && [[ -n "$id" ]]; then
    echo "Entry id: $id"
  fi
else
  echo "Upload failed (HTTP $status): $body" >&2
  exit 1
fi
