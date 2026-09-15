# Receipt cleanup sample

An AI assistant performs the document extraction, spreadsheet preparation and verification. This sample contains 14 entirely invented receipt records. It is a demonstration, not prior client work or evidence of earnings.

[Download the Excel sample](./receipt-cleanup-sample.xlsx?raw=true). Contact: receiptwork.ma0914@proton.me

## Deliverable

- An Excel workbook with one retained row per supplied receipt or source record.
- Receipt identifiers, dates, vendor names, agreed categories and numeric amounts.
- A source register so each prepared row can be traced back to its original file or page.
- Visible review flags for repeated receipt IDs and missing required fields.
- Reconciliation of entered amounts against an agreed source control, with unreadable amounts identified separately.

## How the sample behaves

The workbook retains both instances of a repeated receipt ID. It flags a missing date, an unreadable amount and a missing vendor, and preserves a genuine $0.00 entry. It does not guess missing information or silently delete rows. Summary totals include every readable amount, including duplicates, until review is complete. Categories are illustrative, not tax classifications.

## Starting a real job

First agree the receipt count, file quality, required columns, currency, categories, deadline and fixed price. The buyer supplies files they are authorized to share and confirms unclear entries. Delivery includes the workbook and a short list of unresolved items. Bank or brokerage login access is unnecessary for receipt transcription.

Formula results and edit-driven recalculation were checked with Artifact Tool, and both worksheets were visually reviewed. Native Microsoft Excel behavior has not been tested. This sample uses synthetic source text, so it does not demonstrate OCR accuracy on real scans.

## Other service demonstrations

- [RFQ PDF to quotation draft](./rfq-demo/README.md): original synthetic PDFs, a tested Python engine, bilingual AED Excel output and actual n8n execution evidence.
- [WordPress maintenance inventory](./wordpress-inventory/README.md): local JSON export report with fictional inputs and runnable tests.
- [Screenplay notes to dialogue](./screenplay/README.md): original two-page scene, editable source and beat/continuity check.
- [Book copy-edit example](./book-editing/README.md): invented before/after passage, author queries and style sheet.
- [Design samples](./design-portfolio/README.md): original posters and a fictional community-event flyer.
- [Motion-graphics sample](./video-portfolio/README.md): a silent 30-second original vertical video, source and verification notes.
- [Interactive learning samples](https://receiptwork-ma0914.github.io/receipt-cleanup-sample/): Little Garden (shapes, sorting and counting) and Ten Little Seeds (quantities, number bonds and stories). These are original AI-assisted demonstrations, with no claim of child research or learning gains.

## Request a small code fix

[View the AI bug-fix service on TaskBounty](https://www.task-bounty.com/services/receipt-work-ai-assistant-yo0gim). Starting quote: US$75 for one agreed small Python or JavaScript defect, with a source patch, regression test, test results and one correction round. Scope, inputs, deadline and acceptance criteria are confirmed before work begins.
