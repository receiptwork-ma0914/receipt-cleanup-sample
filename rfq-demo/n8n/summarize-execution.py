"""Preserve selected execution evidence and verify n8n's stored binary files.

Raw execution logs include internal resume state and must not be published.
"""
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent
fixture = sys.argv[1]
if fixture not in ("standard", "unseen"):
    raise SystemExit("Expected standard or unseen")
text = (ROOT / "evidence" / f"{fixture}-raw.log").read_text()
decoder = json.JSONDecoder()
execution = None
for match in re.finditer(r"(?m)^\{", text):
    try:
        candidate, _ = decoder.raw_decode(text[match.start():])
    except ValueError:
        continue
    if isinstance(candidate, dict) and "resultData" in candidate.get("data", {}):
        execution = candidate
        break
assert execution is not None, "No actual n8n execution JSON found"
assert execution.get("status") == "success" and execution.get("finished") is True
result = execution["data"]["resultData"]
assert result["lastNodeExecuted"] == "Download bilingual Excel"
runs = result["runData"]
engine = runs["Create AED review draft"][0]["data"]["main"][0][0]["json"]
evidence = {
    "n8n_version": "2.39.5", "node_version": "26.5.0", "mode": execution["mode"],
    "status": execution["status"], "finished": execution["finished"],
    "started_at": execution["startedAt"], "stopped_at": execution["stoppedAt"],
    "fixture": fixture, "synthetic_only": True, "human_reviewed": False,
    "nodes": [], "binary_verification": {},
}
for name, values in runs.items():
    assert len(values) == 1 and values[0]["executionStatus"] == "success"
    evidence["nodes"].append({"name": name, "status": values[0]["executionStatus"],
                              "duration_ms": values[0]["executionTime"]})
for node_name, kind in [("Load synthetic PDF", "pdf"), ("Download bilingual Excel", "xlsx")]:
    meta = runs[node_name][0]["data"]["main"][0][0]["binary"]["data"]
    mode, file_id = meta["id"].split(":", 1)
    assert mode == "filesystem-v2"
    storage = (ROOT / "runtime/state/.n8n/storage").resolve()
    path = (storage / file_id).resolve()
    assert path.is_relative_to(storage)
    data = path.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    assert digest == engine["input_pdf_sha256" if kind == "pdf" else "output_sha256"]
    if kind == "pdf":
        assert data == (ROOT.parent / "engine/fixtures" / f"{fixture}.pdf").read_bytes()
    else:
        (ROOT / "evidence" / f"{fixture}-from-n8n.xlsx").write_bytes(data)
    evidence["binary_verification"][kind] = {
        "bytes": len(data), "sha256": digest, "matches_engine": True,
        "mime_type": meta["mimeType"],
    }
    execution_id = file_id.split("/executions/")[1].split("/")[0]
    evidence.setdefault("execution_id", execution_id)
    assert evidence["execution_id"] == execution_id
evidence["engine_result"] = {
    key: engine[key] for key in ("status", "rfq_id", "currency", "rows", "matched_rows",
                                "exception_rows", "subtotal_aed", "items")
}
expected = {"standard": (8, 3, 5, "36.90"), "unseen": (4, 3, 1, "56.89")}[fixture]
assert tuple(engine[k] for k in ("rows", "matched_rows", "exception_rows", "subtotal_aed")) == expected
evidence["expected_fixture_summary_matches"] = True
target = ROOT / "evidence" / f"{fixture}-execution.json"
target.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"fixture": fixture, "execution_id": evidence["execution_id"],
                  "status": evidence["status"], "binary_verification": evidence["binary_verification"]}, indent=2))
