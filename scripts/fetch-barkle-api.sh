#!/usr/bin/env bash
set -euo pipefail

# Download the Barkle API OpenAPI spec (api.json)
OUT_DIR="./openapi"
OUT_FILE="$OUT_DIR/api.json"
API_URLS=("https://barkle.chat/api.json" "https://barkle.chat/api" "https://barkle.chat/api.son")

mkdir -p "$OUT_DIR"
echo "Downloading Barkle API spec into $OUT_FILE"
for url in "${API_URLS[@]}"; do
    echo "Trying: $url"
    if curl -s -L --compressed -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' -H 'Accept: application/json' -m 15 "$url" -o "$OUT_FILE"; then
        if [[ -s "$OUT_FILE" ]]; then
            echo "Downloaded API spec from $url"
            exit 0
        fi
    fi
done

echo "Could not download API spec. Please check the URL or connectivity." >&2
exit 1
