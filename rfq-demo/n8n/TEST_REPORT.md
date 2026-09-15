# n8n integration test report

Tested September 15, 2026 with official **n8n 2.39.5**, **Node.js 26.5.0**, Python 3.12.14 environment and local synthetic fixtures. All testing was agent-operated. No human review, client deployment, paid commission or real customer data is represented.

## Actual n8n runs

Both workflows were imported into a new isolated local n8n database and executed through its current CLI. Each ran four nodes: Manual Trigger, PDF download, binary PDF POST to the Python adapter, and Excel download. All four nodes report success in the sanitized execution records.

| Fixture | n8n execution | Time (UTC) | Observed output |
|---|---|---|---|
| Standard | 4 | 13:16:41.317–13:16:41.508 | 8 rows, 3 matched, 5 held for review; matched-row subtotal AED 36.90 |
| Second same-layout fixture (`unseen`) | 3 | 13:14:30.874–13:14:31.139 | 4 rows, 3 matched, 1 held; matched-row subtotal AED 56.89 |

The second fixture was authored with this demonstration. It is not a client-supplied blind acceptance test or evidence that arbitrary PDFs work.

### Binary evidence

The evidence generator read the actual PDF and XLSX files from n8n's binary store. PDF bytes equal the corresponding source fixture; both PDF and downloaded XLSX SHA-256 values equal the engine's recorded hashes. The public workbook files below are copies of n8n's downloaded binary, not separately substituted engine outputs.

| File | Bytes | SHA-256 |
|---|---:|---|
| `evidence/standard-from-n8n.xlsx` | 7758 | `f5cbe5fad04cb558490fd6592a6bc88ca51dab19db31148475f8d8fd9dd3a571` |
| `evidence/unseen-from-n8n.xlsx` | 7364 | `db781ae412e757eb2d7f5713c24d8ee5ee2b08e3832888f074b731290852a62b` |

See `evidence/standard-execution.json` and `unseen-execution.json` for per-node status/duration, input PDF hashes, MIME types, row-level results and verified output counts. Workbook ZIP metadata can change between runs; these hashes identify the exact captured files.

### Arithmetic and review observations

- The standard n8n result's first row reports quantity `0.145`, approved unit price `1.00`, and amount `0.15`.
- The second fixture reports `1.005 × 1.00 → 1.01`, and its nonapproved price remains a review exception without a line amount.
- Both results retain all parsed rows and separate matched subtotals from held items. These are draft quotations requiring buyer review.
- Detailed parsing, catalogue, unit, description, nonapproved-price and rounding tests belong to the engine's own test report; the n8n integration delegates that logic to the engine.

## Import/export and HTTP checks

`export:workflow` read the standard workflow back from the real n8n database. Exported nodes and connections exactly match the imported definition; no credential references exist. `evidence/workflow-standard-export.json` includes only the portable workflow fields from that export, and `workflow-export-verification.json` records the comparison.

Four actual HTTP adapter checks passed (`evidence/wrapper-tests.txt`): valid PDF upload/download with hash equality, invalid PDF rejection, unknown catalogue rejection and browser-origin POST rejection. No arbitrary filesystem path or remote URL is accepted as an engine input.

## Corrections made during verification

The initial CLI log level suppressed the `--rawOutput` result because n8n prints it at info level. Logging was changed to info and the successful standard journey was rerun to capture reviewable evidence. Current n8n ignores the former task-runner disable setting, so it was removed and the internal broker assigned loopback port 8794. Final standard execution 4 confirms the broker starts there and the workflow succeeds. The second-fixture capture preceded that port-only change.

## Review limits

No n8n editor/browser screenshot or editor onboarding test was performed in this integration task. The evidence establishes real CLI import, execution, HTTP binary transport and workbook retrieval. Workbook visual QA is recorded separately in the engine documentation. Docker, cloud hosting, multi-user access, production credentials, other PDF layouts, OCR, automatic outbound sending and real client acceptance remain outside this demonstration.

Raw execution logs and local runtime state are excluded from public files because n8n includes internal resume state and local configuration. No resume token, encryption key, SQLite database or installed runtime is required to review these results.
