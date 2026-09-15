# Little Garden — submission notes

Task **TSK-MVBFKQFP**: Shapes, Colours & Sorting Garden, approximately age three.

**Working HTTPS preview:** https://receiptwork-ma0914.github.io/receipt-cleanup-sample/sorting-garden/

**Complete editable source package:** `little-garden-source.zip`. Unzip and open the `little-garden/` directory. No account, secret, paid service or installation is required to run the lesson.

## What to review

- Shape matching: circle, square and triangle, followed by a smaller turned-square application; two-choice adaptation available.
- Colour sorting: tap a flower, then a matching basket; dots/stripes identify the colour groups without colour alone.
- Counting: reveal one/two/three once each, create a matching collection, then transfer to a different arrangement.
- Every activity includes a picture demonstration, gentle retry/hint, replay/reset/navigation and optional bundled narration. Progress stays only in memory.

The package includes all original source and assets, 12 WAV prompts with provenance, the MIT licence, README, educator guide with Stanford/DREME and NAEYC references, test report, state tests, nine actual browser measurement records and a five-image numbered walkthrough.

## Verification

**18 state tests passed; 22 selected contrast pairs passed.** All three activities were measured at each of **360, 768 and 1280 CSS pixels** in the browser: no horizontal overflow and no rendered button under 64×64 pixels. Complete local journeys included incorrect-answer retries, the final counting arrangement, reset, keyboard activation, two-choice mode and mute/exit state.

The public preview returned anonymous HTTP 200 responses with matching source hashes. Its Welcome → Map → Shapes → My turn → Circle walkthrough reached “Yes! Both are circles.” Full evidence and exact browser details are in TEST_REPORT.md.

## Run and reproduce

```sh
python3 -m http.server 8768 --bind 127.0.0.1
node --test tests/model.test.mjs
node tools/build.mjs
python3 tools/contrast.py
```

Open http://127.0.0.1:8768/ for the local lesson. Runtime expectations: Node.js 26.5.0 (`.node-version`) and Python 3.9.6 or later. Plain static HTML/CSS/JavaScript; no npm dependencies or lockfile needed.

## Review limits

Browser checks were agent-operated simulated learner journeys in a Chromium-based browser, using CSS-width iframes rather than physical touch devices. No child/human-user study, audio listening/hardware test or full screen-reader audit is claimed. The actual default had no animation/transition; the reduced-motion preference was not emulated. Source contains the reduce-motion rule. This is practice, not a validated assessment or a claim of learning gains.
