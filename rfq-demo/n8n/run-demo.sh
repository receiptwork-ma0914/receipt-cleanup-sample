#!/usr/bin/env bash
set -euo pipefail
rfq_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
rfq_fixture="${1:-standard}"
case "$rfq_fixture" in
  standard) rfq_workflow_id=rfqDemoStandard01 ;;
  unseen) rfq_workflow_id=rfqDemoUnseen001 ;;
  *) echo "Usage: bash run-demo.sh [standard|unseen]" >&2; exit 2 ;;
esac
bash "$rfq_dir/cli.sh" import:workflow --input="$rfq_dir/workflow-$rfq_fixture.json"
bash "$rfq_dir/cli.sh" execute --id="$rfq_workflow_id" --rawOutput
