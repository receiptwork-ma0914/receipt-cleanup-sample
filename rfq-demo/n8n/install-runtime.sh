#!/usr/bin/env bash
set -euo pipefail
rfq_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
mkdir -p "$rfq_dir/runtime"
cp "$rfq_dir/runtime-package.json" "$rfq_dir/runtime/package.json"
cp "$rfq_dir/runtime-package-lock.json" "$rfq_dir/runtime/package-lock.json"
npm ci --prefix "$rfq_dir/runtime" --no-audit --no-fund
