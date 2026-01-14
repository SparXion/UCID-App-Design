#!/bin/bash

set -e

API_BASE_URL=${API_BASE_URL:-"https://ucid-backend.fly.dev"}
ADMIN_KEY=${ADMIN_KEY:-""}
AUTH_TOKEN=${AUTH_TOKEN:-""}

EXPORT_DIR=${EXPORT_DIR:-"./exports"}
mkdir -p "$EXPORT_DIR"

START_DATE=$(date -u -v-7d +%Y-%m-%d)
END_DATE=$(date -u +%Y-%m-%d)

HEADER_ADMIN=""
if [ -n "$ADMIN_KEY" ]; then
  HEADER_ADMIN="-H x-admin-key:$ADMIN_KEY"
fi

HEADER_AUTH=""
if [ -n "$AUTH_TOKEN" ]; then
  HEADER_AUTH="-H Authorization:Bearer\ $AUTH_TOKEN"
fi

for TYPE in events surveys prompts; do
  FILE="$EXPORT_DIR/${TYPE}-${START_DATE}_to_${END_DATE}.csv"
  echo "Downloading $TYPE..."
  curl -sS "$API_BASE_URL/api/v1/analytics/export?type=$TYPE&start=$START_DATE&end=$END_DATE" \
    $HEADER_ADMIN \
    $HEADER_AUTH \
    -o "$FILE"
  echo "Saved: $FILE"
  
  # Simple KPI line count
  ROWS=$(($(wc -l < "$FILE") - 1))
  echo "Rows: $ROWS"
  echo ""
done

echo "Done. Files saved in $EXPORT_DIR"
