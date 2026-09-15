#!/usr/bin/env python3
"""Loopback-only synthetic RFQ adapter. No credentials or arbitrary file paths."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
import hashlib
import json
import os
import re
import subprocess
import sys
import uuid

ROOT = Path(__file__).resolve().parent
ENGINE = ROOT.parent / "engine"
ARTIFACTS = ROOT / "artifacts"
PORT = 8792
MAX_PDF = 2 * 1024 * 1024


class Handler(BaseHTTPRequestHandler):
    server_version = "RFQSyntheticAdapter/1.0"

    def reply(self, code, body, content_type="application/json"):
        if isinstance(body, dict):
            body = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlsplit(self.path).path
        if path == "/health":
            return self.reply(200, {"status": "ok", "synthetic_only": True})
        if path in ("/fixtures/standard.pdf", "/fixtures/unseen.pdf"):
            source = ENGINE / "fixtures" / path.rsplit("/", 1)[1]
            if not source.is_file():
                return self.reply(503, {"status": "error", "error": "Fixture is not ready"})
            return self.reply(200, source.read_bytes(), "application/pdf")
        match = re.fullmatch(r"/artifacts/([0-9a-f]{32})/quote.xlsx", path)
        if match:
            source = ARTIFACTS / match.group(1) / "quote.xlsx"
            if source.is_file():
                return self.reply(200, source.read_bytes(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        self.reply(404, {"status": "error", "error": "Unknown resource"})

    def do_POST(self):
        parsed = urlsplit(self.path)
        if parsed.path != "/quote" or parse_qs(parsed.query) != {"catalog": ["approved"]}:
            return self.reply(404, {"status": "error", "error": "Unknown quote route or catalogue"})
        if self.headers.get("Origin"):
            return self.reply(403, {"status": "error", "error": "Browser-origin requests are not accepted"})
        if self.headers.get_content_type() != "application/pdf":
            return self.reply(415, {"status": "error", "error": "Expected application/pdf"})
        try:
            size = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            size = 0
        if not 1 <= size <= MAX_PDF:
            return self.reply(413, {"status": "error", "error": "PDF must be 1 byte to 2 MiB"})
        pdf_bytes = self.rfile.read(size)
        if len(pdf_bytes) != size or not pdf_bytes.startswith(b"%PDF-"):
            return self.reply(400, {"status": "error", "error": "Invalid PDF payload"})
        catalog = ENGINE / "fixtures" / "approved-catalog.csv"
        if not (ENGINE / "quote.py").is_file() or not catalog.is_file():
            return self.reply(503, {"status": "error", "error": "Engine or approved fixture catalogue is not ready"})
        run_id = uuid.uuid4().hex
        run = ARTIFACTS / run_id
        run.mkdir(parents=True)
        pdf = run / "rfq.pdf"
        output = run / "quote.xlsx"
        pdf.write_bytes(pdf_bytes)
        try:
            result = subprocess.run(
                [os.environ.get("RFQ_PYTHON", sys.executable), str(ENGINE / "quote.py"),
                 "--pdf", str(pdf), "--catalog", str(catalog), "--output", str(output)],
                capture_output=True, text=True, timeout=30, check=False,
            )
            summary = json.loads(result.stdout)
            if result.returncode or summary.get("status") != "draft" or not output.is_file():
                return self.reply(422, {"status": "error", "error": summary.get("error", "Engine rejected the input")})
            summary.pop("output", None)
            summary.update({
                "run_id": run_id,
                "input_pdf_sha256": hashlib.sha256(pdf_bytes).hexdigest(),
                "catalog_sha256": hashlib.sha256(catalog.read_bytes()).hexdigest(),
                "output_sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
                "artifact_url": f"http://127.0.0.1:{PORT}/artifacts/{run_id}/quote.xlsx",
                "artifact_relative_path": str(output.relative_to(ROOT)),
                "synthetic_only": True,
            })
            (run / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n")
            self.reply(200, summary)
        except subprocess.TimeoutExpired:
            self.reply(504, {"status": "error", "error": "Engine timed out"})
        except (ValueError, OSError):
            self.reply(500, {"status": "error", "error": "Engine did not return a valid result"})


if __name__ == "__main__":
    print(f"RFQ synthetic adapter listening on http://127.0.0.1:{PORT}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
