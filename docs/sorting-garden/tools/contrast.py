"""Recalculate source palette contrast; this is not a rendered-page audit."""
import json
from pathlib import Path
p = Path(__file__).resolve().parent.parent / 'tests' / 'contrast-check.json'
d = json.loads(p.read_text())
def luminance(colour):
    rgb = [int(colour[i:i+2], 16) / 255 for i in (1, 3, 5)]
    linear = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in rgb]
    return sum(x * weight for x, weight in zip(linear, (0.2126, 0.7152, 0.0722)))
for pair in d['results']:
    low, high = sorted((luminance(pair['foreground']), luminance(pair['background'])))
    ratio = (high + 0.05) / (low + 0.05)
    pair['contrast'] = round(ratio, 3)
    pair['passes'] = ratio >= pair['threshold']
    print(f"{pair['pair']}: {ratio:.3f}:1 ({'pass' if pair['passes'] else 'FAIL'})")
p.write_text(json.dumps(d, indent=2) + '\n')
if not all(pair['passes'] for pair in d['results']):
    raise SystemExit(1)
