# Ten Little Seeds

An original small static lesson for exploring quantities from zero to ten, number bonds and addition/subtraction. Designed around age six with adaptable adult support. No claim of measured learning gains or diagnostic value is made.

## Run locally

The core files are plain HTML, CSS and JavaScript. There are no install-time or runtime third-party dependencies, no package-manager lockfile, secrets, accounts or build service.

Reference development environment: Node.js **24.19.0** for automated tests; Python **3.12** for serving/building. Node 22+ and Python 3.8+ provide the used standard-library features.

```sh
# Install: nothing to install for the website itself.
# Development preview, from this directory:
python3 -m http.server 8000 --bind 127.0.0.1 --directory .
# Open http://127.0.0.1:8000/

# Test pure calculations and state:
node --test tests/*.test.cjs

# Build a clean static deployment directory:
python3 build.py

# Production preview of the built files:
python3 -m http.server 8080 --bind 127.0.0.1 --directory dist
# Open http://127.0.0.1:8080/

# Create the attached complete source archive in the parent directory:
python3 package.py
```

`index.html` can also be opened directly from disk; local classic scripts are used rather than ES modules. HTTP serving is recommended for a consistent preview. Core interactions work offline once the files are local. No service worker or offline cache is installed.

## Public preview and deployment

**Live preview: [https://receiptwork-ma0914.github.io/receipt-cleanup-sample/make-ten/](https://receiptwork-ma0914.github.io/receipt-cleanup-sample/make-ten/)** — public HTTPS, no login required.

Verified on 15 September 2026 UTC: anonymous HTTP requests without cookies returned 200 for the checked HTML, JavaScript, stylesheet and sample MP3, with payloads matching reviewed source bytes. An agent-operated public-browser smoke test completed Begin → My turn → zero Check using Enter; visible and accessible progress both showed 1 of 16. Evidence is in `tests/browser/public-preview-http.json` and `tests/browser/ten-public-smoke.txt`; see `TEST_REPORT.md` for scope and limitations.

To deploy another copy, place the contents of `dist/` on a static HTTPS host, including documentation and screenshots. All assets and in-app document links are relative: the site can live at `/make-ten/` or another directory without configuration changes. No paid hosting or requester-account access is needed.

## Browser expectations

The app targets current Chromium, Firefox and Safari with native buttons, CSS Grid, `<dialog>` and `<progress>`. Expected feature baseline: Chromium 120+, Firefox 122+, Safari 17+. These are support targets, not claims that every browser/version was tested. Actual browser and viewport evidence belongs in `TEST_REPORT.md`.

Optional read-aloud plays one of 17 bundled MP3 recordings only after a button press; the same button stops playback. Navigation and the final problem phase change stop the previous recording. If playback is blocked or fails, the app explains the limitation and keeps every instruction visible. No audio is recorded and no external voice service is used. Main instructions are spoken; titles, hints, counts and feedback remain visible text. See `audio/PROVENANCE.md`, `audio/manifest.json` and `audio/LICENSE-original.txt` for exact strings, hashes, synthesis details and permissions. Only MP3 files are bundled; the manifest also documents the original unbundled WAV exports.

## Architecture

- `content.js`: editable quantity targets, five number bonds, six original one-step stories and a new two-step final problem.
- `model.js`: immutable ten-slot state. Each slot holds 0 (empty), 1 (original seed), or 2 (added seed). Addition protects the starting group; subtraction only restores/removes members of its starting group. Every calculation stays within ten.
- `app.js`: navigation, selected scaffold, current problem/phase, model rendering, live feedback and optional bundled narration. A Set records completed problem IDs, so repeated checks cannot count a problem twice. Navigation preserves checked discoveries while opening a fresh model for the selected problem. Reset/replay clears the Set and all positions.
- `styles.css`: responsive layout, two-row five-column frames, non-colour shape cues, visible focus, 48px minimum action controls and reduced-motion support. There are no animation or dragging requirements.

Progress exists only in page memory. Refresh, closing or Start over clears it. The lesson has no analytics, storage APIs, open chat, child-data fields or background requests. Adult reference links are deliberately grouped under the grown-up guide.

## Known limitations

- Bundled narration uses a synthetic formant voice, whose sound may be unfamiliar. The explicit browser play/stop controls were checked, but auditory listening quality was not reviewed; text and adult co-reading are the fallback.
- An adult may need to explain words or help use a keyboard. The app does not assess a child's readiness.
- The model represents adding to and taking from one bounded group, rather than every mathematical interpretation of addition/subtraction.
- Automated domain tests cannot establish learning effectiveness, full assistive-technology compatibility, or touch/keyboard/browser usability. Actual manual results are recorded separately.

## Included documents

- `SUBMISSION.md`: public preview, package contents and review limitations.
- `EDUCATOR_GUIDE.md`: objectives, walkthrough, adaptations, sources and an offline follow-up.
- `TEST_REPORT.md`: acceptance-to-evidence mapping and honest test status.
- `LICENSE`: MIT permission for original code, content and CSS artwork.
- `THIRD_PARTY_NOTICES.md`: dependencies, fonts and reference attribution.

This is original AI-assisted work. No children were tested or personal information collected.
