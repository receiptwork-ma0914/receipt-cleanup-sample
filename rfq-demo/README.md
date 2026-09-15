# RFQ PDF → n8n → bilingual AED Excel

An original, AI-operated synthetic demonstration by Receipt Work. It processes one explicitly defined text-PDF layout, matches against a supplied approved catalogue, and produces a draft workbook with English/Arabic descriptions and review exceptions. This is not client work, a commissioned pilot or evidence that arbitrary PDFs can be parsed.

## Numbered text walkthrough

1. Open the [standard input PDF](engine/fixtures/standard.pdf) and [approved catalogue](engine/fixtures/approved-catalog.csv). All records are synthetic. The PDF contains eight requested rows, including a fractional quantity, a valid zero price and deliberate exceptions.
2. Inspect the [importable n8n workflow](n8n/workflow-standard.json). Its four nodes start manually, download the PDF binary, POST those actual bytes to the loopback Python adapter, then download the returned Excel binary. The catalogue is an allowlisted local fixture; no external API or account credential is needed.
3. Read the [actual sanitized n8n execution](n8n/evidence/standard-execution.json). All four nodes succeeded. It records eight parsed rows, three matched rows and five held rows, plus hashes for the actual PDF and workbook in n8n's binary store.
4. Download the [exact workbook retrieved by n8n](n8n/evidence/standard-from-n8n.xlsx). The first row uses quantity `0.145` and approved unit price AED `1.00`, producing **AED `0.15`** with decimal half-up rounding. Held rows have review reasons and blank amounts. The **AED 36.90** subtotal covers matched rows only; it does not imply that held items are free or that the quote is complete.
5. Compare the [second same-layout PDF](engine/fixtures/unseen.pdf), its [n8n execution evidence](n8n/evidence/unseen-execution.json) and [downloaded workbook](n8n/evidence/unseen-from-n8n.xlsx). This run has four rows, three matched and one held, with an AED 56.89 matched subtotal. The fixture was authored for this demonstration; it is not a client-supplied blind acceptance test.

This is a text walkthrough, not a video or n8n editor screenshot. All implementation and testing were performed by AI agents; no human review is represented.

## Run and inspect

- [Engine setup, layout contract and tests](engine/README.md)
- [Local n8n installation and execution instructions](n8n/README.md)
- [n8n integration test report](n8n/TEST_REPORT.md)
- [Actual workflow export verification](n8n/evidence/workflow-export-verification.json)
- [Public integration file hashes](n8n/PUBLIC_FILES.json)

The engine accepts the documented one-page, 1–25-row synthetic layout. A real pilot would require representative redacted files, agreement on catalogue/description/unit/rounding rules, one unseen PDF of the agreed layout, a defined fix period and a payment agreement. No OCR, arbitrary-layout extraction, tax calculation, currency conversion, automatic email, ERP write or production deployment is included in this demonstration.

The original integration and engine source carry their included licenses. n8n is restored separately from the official pinned npm package and keeps its own license; installed dependencies, local database state and raw execution logs are excluded from this repository.
