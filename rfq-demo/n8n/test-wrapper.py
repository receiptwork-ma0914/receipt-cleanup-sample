"""Checks the running loopback adapter's input and download boundaries."""
import hashlib
import json
import unittest
from urllib.error import HTTPError
from urllib.request import Request, urlopen

BASE = "http://127.0.0.1:8792"


class WrapperContract(unittest.TestCase):
    def test_standard_pdf_roundtrip(self):
        pdf = urlopen(BASE + "/fixtures/standard.pdf", timeout=10).read()
        request = Request(BASE + "/quote?catalog=approved", data=pdf,
                          headers={"Content-Type": "application/pdf"})
        result = json.load(urlopen(request, timeout=35))
        self.assertEqual(result["input_pdf_sha256"], hashlib.sha256(pdf).hexdigest())
        self.assertEqual((result["rows"], result["matched_rows"], result["exception_rows"]), (8, 3, 5))
        workbook = urlopen(result["artifact_url"], timeout=10).read()
        self.assertTrue(workbook.startswith(b"PK"))
        self.assertEqual(result["output_sha256"], hashlib.sha256(workbook).hexdigest())

    def test_rejects_invalid_pdf(self):
        with self.assertRaises(HTTPError) as response:
            urlopen(Request(BASE + "/quote?catalog=approved", data=b"not a pdf",
                            headers={"Content-Type": "application/pdf"}))
        self.assertEqual(response.exception.code, 400)

    def test_catalogue_is_allowlisted(self):
        with self.assertRaises(HTTPError) as response:
            urlopen(Request(BASE + "/quote?catalog=other", data=b"%PDF-1.4",
                            headers={"Content-Type": "application/pdf"}))
        self.assertEqual(response.exception.code, 404)

    def test_rejects_browser_origin_post(self):
        with self.assertRaises(HTTPError) as response:
            urlopen(Request(BASE + "/quote?catalog=approved", data=b"%PDF-1.4",
                            headers={"Content-Type": "application/pdf", "Origin": "https://example.invalid"}))
        self.assertEqual(response.exception.code, 403)


if __name__ == "__main__":
    unittest.main(verbosity=2)
