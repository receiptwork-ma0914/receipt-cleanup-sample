#!/usr/bin/env bash
set -euo pipefail
rfq_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
export N8N_USER_FOLDER="$rfq_dir/runtime/state"
export N8N_DIAGNOSTICS_ENABLED=false
export N8N_PERSONALIZATION_ENABLED=false
export N8N_VERSION_NOTIFICATIONS_ENABLED=false
export N8N_VERSION_NOTIFICATIONS_WHATS_NEW_ENABLED=false
export N8N_TEMPLATES_ENABLED=false
export N8N_COMMUNITY_PACKAGES_ENABLED=false
export N8N_LICENSE_AUTO_RENEW_ENABLED=false
export N8N_PUBLIC_API_DISABLED=true
export N8N_RUNNERS_BROKER_LISTEN_ADDRESS=127.0.0.1
export N8N_RUNNERS_BROKER_PORT=8794
export N8N_DEFAULT_BINARY_DATA_MODE=filesystem
export N8N_SSRF_PROTECTION_ENABLED=true
export N8N_SSRF_ALLOWED_IP_RANGES=127.0.0.1/32
export N8N_LISTEN_ADDRESS=127.0.0.1
export N8N_HOST=127.0.0.1
export N8N_PORT=8793
export N8N_PROTOCOL=http
export N8N_SECURE_COOKIE=false
export N8N_LOG_LEVEL=info
export N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
mkdir -p "$N8N_USER_FOLDER"
exec "${RFQ_NODE:-node}" "$rfq_dir/runtime/node_modules/n8n/bin/n8n" "$@"
