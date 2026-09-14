# WordPress maintenance inventory demo

**A synthetic demonstration by Receipt Work AI assistant.** The sample plugins,
themes, versions, and report are fictional. They do not describe a client site,
past client work, or a completed maintenance job. This example is not affiliated
with WordPress or any theme vendor.

This small Python tool converts two local WP-CLI JSON inventory exports into a
Markdown report. It is useful for agreeing a maintenance scope: what is installed,
which updates the export advertises, and which entries need clarification.

The tool reads files only. It never connects to WordPress, runs shell commands,
requests credentials, calls a network service, or installs/updates anything.
Reports go to stdout or a **new** output file; existing files are never overwritten.

## Try the fictional example

Requires Python 3.9 or newer. No packages or accounts are needed.

```sh
python3 inventory_report.py \
  --plugins samples/plugins.json \
  --themes samples/themes.json \
  --exported-at 2026-09-14 \
  --label "Synthetic maintenance demo"

python3 -m unittest -v
```

Read [the generated sample report](samples/report.md) without running anything.
To save a fresh report, append `--output new-report.md` to the first command.

## What it checks

- Counts plugins/themes, active items, advertised updates, and unknown update status.
- Keeps original row order and identifies each source row; records input SHA-256 hashes.
- Flags missing target versions, contradictory update metadata, and unknown status values.
- Identifies inactive items for owner review, and parent themes that may still be required.
- Flags must-use plugins/drop-ins for the host or custom-code maintainer to review.
- Rejects malformed exports, repeated JSON keys, duplicate component names, and numeric versions.
- Escapes exported text so names cannot create Markdown links, HTML, or extra table rows.

The test suite includes malformed/incomplete input, unknown and contradictory
update data, Unicode/BOM input, markup handling, input preservation, and refusal
to overwrite existing outputs.

## Using an existing inventory

Each input is an array of objects. `name` must be a nonempty string. Supported
fields are `name`, `status`, `version`, `update`, `update_version`, and `auto_update`;
the other fields may be strings, null, or absent. Missing values remain unknown.
Extra export fields are ignored. Use one site's exports per report; do not combine
multisite inventories with repeated names. The operator supplies the export date;
the tool cannot verify when the underlying update check happened.

For a site owner who already uses WP-CLI, these documented list commands can
produce suitable input files on their own WordPress environment:

```sh
wp plugin list --fields=name,status,version,update,update_version,auto_update --format=json > plugins.json
wp theme list --fields=name,status,version,update,update_version,auto_update --format=json > themes.json
```

These export commands are **separate from this Python tool**. WP-CLI loads the
WordPress environment and may refresh update information; they should be run by
the site operator with their normal access and procedures. WP-CLI documents a
separate `--status=dropin` view for drop-ins. This report only covers rows supplied
to it, and does not assert a complete component inventory.

Official input-format references, checked 14 September 2026:

- [WP-CLI plugin list](https://developer.wordpress.org/cli/commands/plugin/list/)
- [WP-CLI theme list](https://developer.wordpress.org/cli/commands/theme/list/)

## Limits

An export saying `update: none` does not establish that a component is secure or
current. Cached checks, premium/custom components, licenses, and export age need
separate review. Version strings are preserved, not semantically compared.

This example does not inspect source code, WordPress core, backups, vulnerabilities,
PHP compatibility, a live site, or form delivery. It cannot diagnose an Enfold CSS
or shortcode problem from an inventory alone. Actual work needs an agreed defect
or update scope, suitable backup/staging access, and before/after acceptance checks.

## Files

- `inventory_report.py` — local report generator, Python standard library only.
- `test_inventory_report.py` — runnable tests.
- `samples/plugins.json`, `samples/themes.json` — wholly fictional exports.
- `samples/report.md` — generated from those exports.
