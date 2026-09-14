#!/usr/bin/env python3
"""Summarize local WP-CLI JSON exports. No network or WordPress access."""

import argparse
from collections import Counter
from datetime import date
import hashlib
import html
import json
from pathlib import Path
import sys


FIELDS = ("name", "status", "version", "update", "update_version", "auto_update")
STATUSES = {
    "plugin": {"active", "active-network", "inactive", "must-use", "dropin"},
    "theme": {"active", "parent", "inactive"},
}


class InventoryError(ValueError):
    """An export cannot be reported reliably."""


def unique_object(pairs):
    """Reject repeated JSON keys rather than silently keeping the last value."""
    result = {}
    for key, value in pairs:
        if key in result:
            raise InventoryError(f"Repeated JSON key: {key!r}")
        result[key] = value
    return result


def load_inventory(path, kind):
    raw = path.read_bytes()
    try:
        rows = json.loads(raw.decode("utf-8-sig"), object_pairs_hook=unique_object)
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise InventoryError(f"{kind} export must be a UTF-8 JSON array: {exc}") from exc
    if not isinstance(rows, list):
        raise InventoryError(f"{kind} export must contain an array of objects")
    seen = set()
    validated = []
    for index, row in enumerate(rows, 1):
        if not isinstance(row, dict):
            raise InventoryError(f"{kind} row {index} must be an object")
        if not isinstance(row.get("name"), str) or not row["name"].strip():
            raise InventoryError(f"{kind} row {index} needs a nonempty name")
        name = row["name"]
        if name in seen:
            raise InventoryError(f"Duplicate {kind} name {name!r}; separate site exports")
        seen.add(name)
        for field in FIELDS:
            if field in row and row[field] is not None and not isinstance(row[field], str):
                raise InventoryError(f"{kind} row {index}: {field} must be a string or null")
        validated.append({field: row.get(field) or "" for field in FIELDS})
    return validated, hashlib.sha256(raw).hexdigest()


def cell(value):
    """Escape arbitrary input so it remains text inside a Markdown table."""
    value = " ".join(str(value).split())
    return "".join(
        f"&#{ord(char)};" if char in "\\`*_{}[]()#+-.!|" else html.escape(char, quote=True)
        for char in value
    ) or "Unknown"


def review_notes(row, kind):
    notes = []
    if row["status"] not in STATUSES[kind]:
        notes.append("Activation status missing or unrecognized")
    if not row["version"].strip():
        notes.append("Installed version missing")
    if row["auto_update"] not in {"on", "off"}:
        notes.append("Auto-update setting missing or unrecognized")
    if row["update"] == "available":
        notes.append("Review changelog and test update in staging")
        if not row["update_version"].strip():
            notes.append("Target version missing: confirm with vendor")
    elif row["update"] == "none":
        if row["update_version"].strip():
            notes.append("Conflicting export: target version present with update=none")
    else:
        notes.append("Update availability unknown: confirm with vendor")
    if row["status"] == "inactive":
        notes.append("Confirm whether this inactive item is still needed")
    if kind == "theme" and row["status"] == "parent":
        notes.append("Parent theme may be required by the active child theme")
    if kind == "plugin" and row["status"] in {"must-use", "dropin"}:
        notes.append("Confirm host or custom-code maintenance responsibility")
    return notes


def make_report(plugins, themes, hashes, exported_at, label):
    lines = [
        f"# {cell(label)}", "",
        "Prepared by Receipt Work AI assistant from local inventory exports.", "",
        f"Export date supplied by operator: **{exported_at}** (not independently verified).", "",
        "This is an inventory review. It does not establish security, compatibility, "
        "backup readiness, license validity, or successful updates.", "",
    ]
    for kind, rows, digest in (("plugin", plugins, hashes[0]), ("theme", themes, hashes[1])):
        counts = Counter(row["update"] for row in rows)
        unknown = len(rows) - counts["available"] - counts["none"]
        active = sum(row["status"] in {"active", "active-network"} for row in rows)
        review_count = sum(bool(review_notes(row, kind)) for row in rows)
        lines += [
            f"## {kind.title()} inventory", "",
            f"Source SHA-256: `{digest}`", "",
            f"{len(rows)} entries; {active} active; {counts['available']} update(s) advertised; "
            f"{counts['none']} with no update advertised; {unknown} with unknown update availability.", "",
            f"Entries with review notes: {review_count}. Versions are copied as text, not compared.", "",
        ]
        if not rows:
            lines += ["The supplied export is empty. Site completeness has not been verified.", ""]
            continue
        lines += [
            "| Source row | Name | Status | Installed | Update flag | Target | Auto-update | Review notes |",
            "| --- | --- | --- | --- | --- | --- | --- | --- |",
        ]
        for index, row in enumerate(rows, 1):
            notes = review_notes(row, kind)
            values = [index, row["name"], row["status"], row["version"], row["update"],
                      row["update_version"] or "Not supplied", row["auto_update"],
                      "; ".join(notes) or "No additional inventory flags"]
            lines.append("| " + " | ".join(cell(value) for value in values) + " |")
        lines.append("")
    lines += [
        "## Before any maintenance", "",
        "- Agree the items, price, and acceptance checks with the site owner.",
        "- Confirm a usable backup and rollback procedure; test changes in staging.",
        "- Review vendor release notes, compatibility, and premium license access.",
        "- Check agreed pages, layout, and forms before and after the change.",
        "- Record the actual changes and test results separately from this inventory.", "",
        "A `none` flag only means the export advertised no update. Cached results, "
        "custom/premium components, and unknown export age can limit coverage. "
        "No live site was inspected by this tool.", "",
    ]
    return "\n".join(lines)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--plugins", type=Path, required=True)
    parser.add_argument("--themes", type=Path, required=True)
    parser.add_argument("--exported-at", type=date.fromisoformat, required=True, metavar="YYYY-MM-DD")
    parser.add_argument("--label", default="WordPress maintenance inventory")
    parser.add_argument("--output", type=Path, help="Create a new Markdown file; refuses to overwrite")
    args = parser.parse_args(argv)
    try:
        plugins, plugin_hash = load_inventory(args.plugins, "plugin")
        themes, theme_hash = load_inventory(args.themes, "theme")
        report = make_report(plugins, themes, (plugin_hash, theme_hash), args.exported_at, args.label)
        if args.output:
            with args.output.open("x", encoding="utf-8", newline="\n") as handle:
                handle.write(report)
        else:
            sys.stdout.write(report)
    except (OSError, InventoryError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
