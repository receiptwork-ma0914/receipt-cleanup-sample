# Chance Bureau — Probability Detective

A complete, original static lesson about theoretical probability, observed frequency, sample variation and equal expected points. Intended for approximately age 12, with individual differences and optional adult support. Typical session: 10–15 minutes.

## Run locally

No package installation, account, network service or secret is required. All five application files are bundled. Opening `index.html` directly works because scripts use ordinary deferred browser scripts rather than ES modules. For a local HTTP preview, from this directory:

```sh
python3 -m http.server 8784 --bind 127.0.0.1 --directory .
```

Open `http://127.0.0.1:8784/`. Stop the server with Ctrl+C. Python 3.12 is the documented serving runtime; the app itself does not use Python.

### Development, tests, build and production preview

There is no install step and no dependency lockfile because there are no packages. Node.js 26.5.0 was used for the recorded tests and build. From this directory:

```sh
# Automated domain/state tests
node --test tests/domain.test.cjs

# Check the three browser scripts for syntax errors
node --check domain.js
node --check content.js
node --check app.js

# Build: copy the five app files into dist/ without transforming them
node build.cjs

# Production preview of exactly that output
python3 -m http.server 8784 --bind 127.0.0.1 --directory dist
```

Development consists of editing `index.html`, `styles.css`, `content.js`, `domain.js` or `app.js`, then reloading the development preview. Deploy the contents of `dist/` to any static HTTPS host, including GitHub Pages. Serve `index.html` at the directory root. No build-time or runtime environment variables are needed. Nothing must be deployed into the requester's accounts.

## Activities

1. **Coin laboratory:** optional prediction; fair or explicitly adjustable coin; fresh samples of 10, 100 and 1,000; current counts, proportions, chart and six-sample comparison table; independence reasoning with hints and unlimited retry.
2. **Dice investigation:** optional prediction; one fair die or sums of two independent fair dice; generated samples, theory/observation chart and equivalent table; an ordered-pair reasoning check.
3. **Fair-game designer:** choose scoring faces and rewards in a non-monetary points model; predict and inspect exact expected-point arithmetic; simulate actual rounds; complete a fresh token-game claim/evidence challenge.

The notebook records the latest collected evidence and key conclusions. Each experiment can reset independently. A whole-lesson reset returns to the opening screen without a reload. State is held only in memory; refresh intentionally starts over.

## Architecture and model

- `domain.js`: pure sampling, enumeration, expected-point and lesson-state functions. It exports both a browser global and a CommonJS module for testing.
- `content.js`: original feedback/hint wording, separated from UI handlers.
- `app.js`: in-memory state, input validation, chart/table rendering and native-control event handling. Chart and table rows are derived from the same result objects.
- `index.html` and `styles.css`: semantic page structure, responsive layout, original CSS artwork and reduced-motion rule.
- `tests/domain.test.cjs`: injected random draws and seeded streams check actual counts, boundaries, rule arithmetic, state and reproducibility.

Each coin flip compares one browser `Math.random()` value in `[0,1)` with the configured heads probability. Each die face is `1 + floor(6 × random())`; two-dice sums use two draws. The app never adjusts counts to match theoretical proportions. A fresh experiment replaces the current sample; coin history retains the last six labelled samples. Browser pseudorandomness is suitable for this teaching simulation, not security or physical verification. Tests inject deterministic draws or use the included seeded generator; the learner's samples normally vary.

The game defines fairness as **equal expected points per round**, not equal scoring frequency, equal variance, or a guaranteed tied match. A scores its reward on the first chosen number of die faces; B scores its reward on the remaining faces. Expected points are scoring-face count divided by six, multiplied by that side's reward. Integer numerators decide equality; rounded display decimals do not decide it.

## Accessibility, privacy and supported browsers

Native buttons, selects, numeric inputs, labels, visible focus, a skip link, live feedback and text/table chart alternatives provide non-drag interaction. Controls target at least 44 CSS pixels. Core content has no animation, sound, flashing or time limit; a reduced-motion CSS rule is included. The design targets WCAG 2.2 AA, but this is not a formal conformance certification.

Expected support: Chrome/Edge 120+, Firefox 115+, Safari 17+, and corresponding modern mobile browsers. Actual tested browser versions, viewport evidence, keyboard/touch walkthrough and known review limits are recorded in `TEST_REPORT.md`; expected support is not a claim that every browser was tested.

No runtime external requests, analytics, cookies, local storage, child information, uploads, chat, login, wallet, purchases or real gambling appear in the lesson. Educational source links are kept in `EDUCATOR_GUIDE.md` for adults. The HTML only references bundled local assets. A web host may maintain its own ordinary access logs, outside this application's control.

## Known limitations

- This is a compact teaching model, not a measured learning-efficacy study or a diagnostic tool. No testing with children was conducted.
- Pseudorandom draws approximate independent random trials; they do not model the mechanics or imperfections of a physical coin or die.
- Percentages display to one decimal place, so rounded category percentages can sum slightly above/below 100%; totals and counts use unrounded numbers.
- The fair-game reward controls intentionally allow only integer points from 1–6, and the coin control uses whole percentage points from 0–100.
- Only the most recent six coin experiments remain in the comparison table. All progress disappears on refresh or closing the page.
- Arbitrary learner prose is not collected or machine-graded. The final challenge evaluates two explicit selections and explains their arithmetic.
- No optional audio is implemented; all content is readable text.

## Package and authorship

Source and original lesson content are licensed under MIT; see `LICENSE` and `THIRD_PARTY_NOTICES.md`. Created by Receipt Work, an AI assistant. Source remains independently runnable if a public preview later disappears. Public preview/source-archive publication is handled separately from development and must be verified in the final submission record.
