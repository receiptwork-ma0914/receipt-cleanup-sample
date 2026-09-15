# Little Garden

Three short, original early-maths activities for approximately age three, with a grown-up nearby: shape matching, two-colour sorting with redundant pattern cues, and one-to-three counting with matching collections. No reading, typing, score, timer or account is required. Stop at any point.

## Run locally

No installation or package download is required. Tested tooling: **Node.js 26.5.0**, **Python 3.9.6**, macOS. Runtime expectations are pinned in `.node-version`; Python 3.9.6 or later can serve the static files. No npm dependencies means no dependency lockfile is needed.

From this directory:

```sh
# Install: nothing to install.
# Development preview (open http://127.0.0.1:8768):
python3 -m http.server 8768 --bind 127.0.0.1
# Domain/state tests:
node --test tests/model.test.mjs
# Production build (copies public assets to dist/):
node tools/build.mjs
# Production preview (open http://127.0.0.1:8769):
python3 -m http.server 8769 --bind 127.0.0.1 --directory dist
```

Use an HTTP server, not a `file://` URL: native JavaScript modules require an HTTP origin in common browsers. The lesson works offline when served locally; all required assets, spoken prompts and lesson data are bundled. The adult reference links require the internet only if opened. There is no required backend, secret, hosted API, generative-AI runtime or build service.

## Deploy

Upload the **contents** of `dist/` to any static HTTPS host. No paid subscription or requester account is necessary. All asset URLs are relative; deployment under a subdirectory such as `/sorting-garden/` is supported. Preserve the directory structure. Do not upload the parent task-evidence directory.

**Public preview:** [Open Little Garden](https://receiptwork-ma0914.github.io/receipt-cleanup-sample/sorting-garden/). Anonymous HTTP checks on September 15, 2026 returned 200 for the page and sampled script/style/audio assets, with bytes matching this reviewed source. A public-browser walkthrough reached the circle-matching success state. See `TEST_REPORT.md` and `tests/browser/public-preview-http.json`. The independently runnable source archive remains usable if that host disappears.

## Browser expectations

Actual browser verification: Codex in-app browser with a Chrome/152.0.0.0 user agent, at 360×1000, 768×1000 and 1280×1000 CSS iframe sizes. All three activity layouts at every width had no horizontal overflow and no rendered button below 64×64 CSS pixels. Full journeys, retries, reset, a keyboard action, two-choice mode and mute/exit state were exercised. See `TEST_REPORT.md`, its nine raw browser records and five original screenshots.

The app uses standards-based ES modules, semantic HTML buttons, SVG, CSS Grid/Flexbox and HTML audio. Target browsers are current desktop/mobile Chrome, Edge, Firefox and Safari; browser-specific versions actually tested are recorded in `TEST_REPORT.md`. These targets are not a claim that all have been tested. JavaScript is required. A static no-script adult activity suggestion is included.

Recorded WAV prompts play only after a tap or keyboard activation. Browser-native speech can supplement them for specific dynamic feedback; unavailable or blocked speech does not affect state or controls. Muting stops queued sound. Sound is never necessary: diagrams, highlighted matches, patterns, visible collections and adult-readable feedback remain available.

## Contents and architecture

- `content.mjs`: activity labels, prompts, shape variants, sorting trays and count targets.
- `model.mjs`: pure state reducer. Only valid actions change activity state. Shape identity is checked directly; sorting compares one group attribute; counting compares integer collection sizes. There is **no score**, inferred ability level or remote model.
- `app.mjs`: original inline SVG art, semantic controls, view rendering, optional audio and focus handling. Every core activity uses tapping/keyboard; there is no drag dependency or canvas.
- `style.css`: responsive layout, 64px minimum button dimensions, visible focus, pattern cues and reduced-motion override. No animations run automatically.
- `assets/audio/`: bundled recordings and manifest with exact scripts/hashes.
- `tests/model.test.mjs`: meaningful state and edge-case tests using Node’s standard library.
- `EDUCATOR_GUIDE.md`: purpose, walkthrough, adaptations, sources and limits.
- `TEST_REPORT.md`: actual test observations, browser measurements, screenshots and explicit limitations.
- `SUBMISSION.md`: live preview, package contents and concise review notes.
- `LICENSE`, `THIRD_PARTY_NOTICES.md`: permissive source/media terms and attribution.

State lives in memory only. Refresh starts fresh. “Start again” resets the activity; “Reset garden” clears exploration check marks while retaining the current sound and choice settings. Two-choice mode always includes the matching shape. No cookies, local storage, child data, analytics, ad code, uploads or external runtime requests are used.

## Known limitations

This is a brief co-play lesson, not a curriculum, validated assessment or individualized intervention. Native speech uses only a browser-reported local English voice and varies; bundled synthesized narration is intentionally simple and may sound mechanical. No child research or efficacy testing has been performed. Labels are in English. The UI supports keyboard and screen-reader names, but no claim of a full assistive-technology audit is made without recorded evidence. No physical touch-device, auditory listening or alternate reduced-motion-preference test was performed; these are disclosed limits, not passes. The actual default had no animations or transitions. Browser details are in the test report.
