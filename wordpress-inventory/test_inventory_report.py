import contextlib
from datetime import date
import hashlib
import io
import json
from pathlib import Path
import tempfile
import unittest

import inventory_report as report


class InventoryTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def export(self, rows, name="plugins.json"):
        path = self.root / name
        path.write_text(json.dumps(rows, ensure_ascii=False), encoding="utf-8")
        return path

    def test_sample_keeps_source_rows_and_unknown_availability(self):
        samples = Path(__file__).parent / "samples"
        plugins, phash = report.load_inventory(samples / "plugins.json", "plugin")
        themes, thash = report.load_inventory(samples / "themes.json", "theme")
        text = report.make_report(plugins, themes, (phash, thash), date(2026, 9, 14), "Demo")
        self.assertIn("5 entries; 2 active; 2 update(s) advertised; 2 with no update advertised; 1 with unknown", text)
        self.assertIn("| 3 | fictional&#45;premium&#45;gallery | active | 2026&#46;09&#45;beta&#46;2 | unavailable |", text)
        self.assertIn("Parent theme may be required by the active child theme", text)
        self.assertIn(hashlib.sha256((samples / "plugins.json").read_bytes()).hexdigest(), text)

    def test_utf8_bom_and_unicode(self):
        path = self.root / "unicode.json"
        path.write_bytes(b"\xef\xbb\xbf" + '[{"name":"café"}]'.encode())
        rows, _ = report.load_inventory(path, "plugin")
        self.assertEqual(rows[0]["name"], "café")
        self.assertIn("Installed version missing", report.review_notes(rows[0], "plugin"))

    def test_duplicate_items_are_rejected_not_merged(self):
        path = self.export([{"name": "same", "version": "1"}, {"name": "same", "version": "2"}])
        with self.assertRaisesRegex(report.InventoryError, "Duplicate plugin name"):
            report.load_inventory(path, "plugin")

    def test_duplicate_json_keys_are_rejected(self):
        path = self.root / "duplicate-key.json"
        path.write_text('[{"name":"one","update":"none","update":"available"}]')
        with self.assertRaisesRegex(report.InventoryError, "Repeated JSON key"):
            report.load_inventory(path, "plugin")

    def test_invalid_shapes_fail_with_clear_errors(self):
        for value in ({"name": "not-an-array"}, [None], [{"name": " "}]):
            with self.subTest(value=value), self.assertRaises(report.InventoryError):
                report.load_inventory(self.export(value), "plugin")

    def test_numeric_versions_are_not_silently_converted(self):
        with self.assertRaisesRegex(report.InventoryError, "version must be a string"):
            report.load_inventory(self.export([{"name": "demo", "version": 1.10}]), "plugin")

    def test_unrecognized_fields_do_not_become_a_clean_bill_of_health(self):
        rows, _ = report.load_inventory(self.export([{"name": "demo", "status": "future-status", "update": None}]), "plugin")
        notes = report.review_notes(rows[0], "plugin")
        self.assertIn("Activation status missing or unrecognized", notes)
        self.assertIn("Update availability unknown: confirm with vendor", notes)

    def test_available_update_without_version_needs_confirmation(self):
        rows, _ = report.load_inventory(self.export([{"name": "demo", "update": "available"}]), "plugin")
        self.assertIn("Target version missing: confirm with vendor", report.review_notes(rows[0], "plugin"))

    def test_contradictory_update_metadata_is_flagged(self):
        rows, _ = report.load_inventory(self.export([{"name": "demo", "update": "none", "update_version": "2"}]), "plugin")
        self.assertIn("Conflicting export: target version present with update=none", report.review_notes(rows[0], "plugin"))

    def test_whitespace_versions_are_treated_as_missing(self):
        rows, _ = report.load_inventory(self.export([{"name": "demo", "version": "  ", "update": "available", "update_version": "\t"}]), "plugin")
        notes = report.review_notes(rows[0], "plugin")
        self.assertIn("Installed version missing", notes)
        self.assertIn("Target version missing: confirm with vendor", notes)

    def test_report_cells_cannot_inject_markup_or_extra_rows(self):
        malicious = '<script>alert(1)</script>|\n[link](https://example.com)'
        rows, digest = report.load_inventory(self.export([{"name": malicious}]), "plugin")
        text = report.make_report(rows, [], (digest, "empty"), date(2026, 9, 14), malicious)
        self.assertNotIn("<script>", text)
        self.assertNotIn("[link]", text)
        self.assertIn("&#124;", text)
        table_rows = [line for line in text.splitlines() if line.startswith("| 1 |")]
        self.assertEqual(len(table_rows), 1)
        self.assertEqual(table_rows[0].count("|"), 9)
        self.assertEqual(report.cell("owner's \"label\""), "owner&#x27;s &quot;label&quot;")

    def test_cli_preserves_inputs_and_refuses_output_overwrite(self):
        plugins = self.export([{"name": "example"}])
        themes = self.export([], "themes.json")
        before = (plugins.read_bytes(), themes.read_bytes())
        target = self.root / "report.md"
        argv = ["--plugins", str(plugins), "--themes", str(themes), "--exported-at", "2026-09-14", "--output", str(target)]
        self.assertEqual(report.main(argv), 0)
        self.assertEqual(before, (plugins.read_bytes(), themes.read_bytes()))
        first = target.read_bytes()
        with contextlib.redirect_stderr(io.StringIO()):
            self.assertEqual(report.main(argv), 2)
        self.assertEqual(target.read_bytes(), first)
        argv[-1] = str(plugins)
        with contextlib.redirect_stderr(io.StringIO()):
            self.assertEqual(report.main(argv), 2)
        self.assertEqual(plugins.read_bytes(), before[0])

    def test_bad_json_creates_no_report(self):
        plugins = self.root / "bad.json"
        plugins.write_text('[{"name":')
        themes = self.export([], "themes.json")
        target = self.root / "not-created.md"
        with contextlib.redirect_stderr(io.StringIO()):
            status = report.main(["--plugins", str(plugins), "--themes", str(themes), "--exported-at", "2026-09-14", "--output", str(target)])
        self.assertEqual(status, 2)
        self.assertFalse(target.exists())

    def test_empty_inventory_does_not_claim_site_is_current(self):
        text = report.make_report([], [], ("a", "b"), date(2026, 9, 14), "Empty")
        self.assertEqual(text.count("Site completeness has not been verified"), 2)
        self.assertNotIn("up to date", text.lower())


if __name__ == "__main__":
    unittest.main()
