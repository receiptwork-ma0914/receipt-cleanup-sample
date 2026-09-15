# Little Garden — test report

## Evidence status

Implementation/state tests performed September 15, 2026 UTC, on macOS with Node.js **26.5.0** and Python **3.9.6**. No testing with children or collection of child information occurred. The browser walkthrough, nine activity/width measurements, source checks and documented limits are recorded below. These results support the tested flows in one browser; they do not imply all-browser or full assistive-technology certification.

Public HTTPS preview: [Little Garden](https://receiptwork-ma0914.github.io/receipt-cleanup-sample/sorting-garden/) — verified as described below.

## Automated tests actually run

Command: `node --test tests/model.test.mjs` — **18 passed, 0 failed**.

The tests cover complete educational journeys and failure modes, rather than merely asserting the UI text:

- Each activity begins in demonstration and requires explicit practice input.
- Wrong shape supplies a useful identity cue and allows correction.
- Two-choice mode retains exactly one target in every round.
- Circle, square and triangle are practiced before the transformed square.
- Unsolved next and unrecognized choices cannot skip practice.
- Sorting requires selection, preserves wrong attempts, and rejects invalid indexes/groups.
- Repeated placement cannot duplicate a flower; transfer tray changes order/group size.
- Counting each target of one/two/three produces exactly one new highlighted index per object, even with twelve rapid simulated reveal actions.
- Matching garden cannot be built/checked before the reference is counted.
- Too few/many flowers gets an appropriate retry; grow/remove are bounded 0–3 under 100 repeated actions.
- All counting rounds require an actual matching collection.
- Solved stages stop further educational changes until explicit next.
- Restart clears only the current activity; mute, exit and full reset work in every stage.
- Repeated completion does not duplicate exploration marks.

Syntax check: `node --check app.mjs` — passed. `node tools/build.mjs` completed successfully. Eight local HTTP requests returned 200 with appropriate HTML/CSS/JavaScript/WAV MIME types and byte-for-byte matches to source; raw observations are in `tests/http-check.json`. These are serving checks, not browser rendering checks. All twelve bundled WAV hashes matched their generation manifest.

## Source accessibility checks and actual contrast calculation

Command: `python3 tools/contrast.py` — **22 selected palette pairs meet their applicable threshold**, using WCAG sRGB relative luminance. The full foreground/background values and ratios are in `tests/contrast-check.json`. Normal text was checked against 4.5:1 and active borders, focus cues and redundant patterns against 3:1. These are calculations from source colours, not a rendered screenshot audit or a claim of complete WCAG conformance.

| Representative pair | Contrast |
|---|---:|
| Main text on cream | 10.611:1 |
| Secondary text on green card, the lowest normal-text pair checked | 5.322:1 |
| White primary-button label on green | 9.274:1 |
| Focus outline on soft-button background | 5.504:1 |
| Light dots on red / light stripes on blue | 5.972:1 / 5.698:1 |
| Empty counting placeholder border on patch, after repair | 5.478:1 |

The initial empty-placeholder border measured 1.871:1 at 70% opacity. It was darkened and made opaque; the revised calculation passed. The production bundle was rebuilt.

Source inspection: all buttons declare minimum dimensions of 64×64 CSS pixels. The narrow-layout shape buttons are 85×85 and flower buttons 80×92. The reduced-motion media query disables animation, transition and smooth scrolling for elements and pseudo-elements. No animation/transition or forced-scroll behavior is otherwise declared. These findings do not substitute for measured viewport/control bounds or an actual reduced-motion browser check.

## Browser observations recorded so far

Independent agent-operated browser walkthrough: root agent, using its browser connection; results communicated September 15, 2026 UTC. No human-user study is claimed. Browser: Codex in-app browser, reporting `Chrome/152.0.0.0`, platform `MacIntel`, device pixel ratio 2. Full user-agent strings and timestamps are preserved in the attached measurement JSON.

| Steps actually performed | Observed outcome |
|---|---|
| Choose square when the shape target is a circle | Gentle hint appeared and the activity stayed usable |
| Activate the correct circle choice using Enter | Correct match accepted; Next received/retained focus |
| Complete the circle, square, triangle and smaller rotated-square rounds | All four shape rounds completed and the activity summary rendered |
| In sorting, choose the blue striped basket for a selected red dotted flower | A helpful non-colour pattern cue appeared |
| Complete both sorting trays using the correct groups | Both trays completed after the initial wrong-basket retry |
| Complete the one-, two- and three-flower counting rounds; check an empty learner collection once, then correct it | The mismatch prompted a retry; the corrected collections were accepted |
| Inspect the final count target | DOM reported “3 visible flowers; flower 3 highlighted”; Reveal was disabled at three |
| Return to the garden after all three activities | All three explored marks, skill summaries and the next practice suggestion appeared |
| Choose Grow a new garden | All exploration check marks cleared |
| Operate Shape beds in the 360px iframe with keyboard Enter | The control operated; this was keyboard use in a narrow browser frame, not physical-device touch testing |
| At 360px, choose Two choices in the guide and return to Shape beds | Two choices appeared and retained the correct circle |
| At 360px, activate Replay, then Mute, then Exit | The mute control's accessible state changed; Exit returned to the welcome screen while remaining muted. Sound audibility was not assessed |

The desktop walkthrough used pointer clicks and Enter. A screenshot review by the builder confirmed the expected visible shapes, patterned groups, three-object collection and completion summary. No browser pass beyond these reported observations is inferred.

## Browser layout measurements: all nine activity/width combinations

Root entered each activity in same-origin iframe fixtures sized to **360×1000, 768×1000 and 1280×1000 CSS pixels**, then activated an outside-the-frame read-only measurement button. The harness inspected the actual iframe DOM without changing lesson state. These are real browser layout measurements at constrained CSS widths, not physical phone/tablet tests or a claim of emulated touch hardware. Rendered controls below the vertical fold are included; ordinary vertical scrolling is allowed.

Every snapshot had equal document client/scroll widths, zero horizontally overflowing buttons, and no button below 64 CSS pixels in either dimension. Each raw record includes all button bounds and identifies the visible activity headings.

| Frame CSS size | Activity | Client / scroll width | Rendered buttons | Minimum button W×H | Overflow / undersized | Evidence |
|---|---|---|---:|---|---|---|
| 360×1000 | Shape beds | 360 / 360 | 10 | 64×64 | 0 / 0 | [JSON](tests/browser/garden-360-shapes.json) |
| 360×1000 | Colour baskets | 360 / 360 | 12 | 64×64 | 0 / 0 | [JSON](tests/browser/garden-360-sorting.json) |
| 360×1000 | Growing together | 360 / 360 | 11 | 64×64 | 0 / 0 | [JSON](tests/browser/garden-360-counting.json) |
| 768×1000 | Shape beds | 768 / 768 | 10 | 127.53×64 | 0 / 0 | [JSON](tests/browser/garden-768-shapes.json) |
| 768×1000 | Colour baskets | 768 / 768 | 12 | 100×64 | 0 / 0 | [JSON](tests/browser/garden-768-sorting.json) |
| 768×1000 | Growing together | 768 / 768 | 11 | 64×64 | 0 / 0 | [JSON](tests/browser/garden-768-counting.json) |
| 1280×1000 | Shape beds | 1280 / 1280 | 10 | 127.53×64 | 0 / 0 | [JSON](tests/browser/garden-1280-shapes.json) |
| 1280×1000 | Colour baskets | 1280 / 1280 | 12 | 100×64 | 0 / 0 | [JSON](tests/browser/garden-1280-sorting.json) |
| 1280×1000 | Growing together | 1280 / 1280 | 11 | 64×64 | 0 / 0 | [JSON](tests/browser/garden-1280-counting.json) |

Measurements were captured **2026-09-15 02:08:36–02:08:39 UTC**. Full browser UA: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36`.

**Motion:** all nine records found zero rendered elements with a nonzero running animation or transition duration; sampled HTML/body/button styles had no animation and 0-second durations, with automatic scrolling. The actual browser preference was `prefers-reduced-motion: false`; the harness did not change it. The reduce preference was **not emulated**. Reduced-motion support is additionally source-verified by the dedicated media rule, but no alternate-preference browser pass is claimed.

## Acceptance mapping

| Published example | Automated/source evidence | Recorded browser evidence |
|---|---|---|
| Enter all three activities by taps and demonstrations | Demo-gate state tests and picture demonstrations | All three activity journeys completed using pointer clicks and Enter |
| Wrong shape stays usable and offers a cue | Wrong-shape retry test; dashed correct-choice outline | Wrong square/circle-target attempt followed by successful correction |
| Three objects highlighted exactly once each | Reveal test records `[0,1,2]`, ignores further reveal input | Three visible target flowers; flower 3 highlighted; Reveal disabled; all count rounds completed |
| Colour sorting does not rely on colour alone | Consistent dotted/striped item and basket cues; contrast calculated | Wrong basket produced the matching pattern cue; both trays completed correctly |
| Replay, mute, reset and leaving work throughout | State coverage across demo/practice/complete; cancelled audio callbacks invalidated | Correct-choice keyboard focus, leaving activities, full garden reset, Replay/Mute state and muted Exit observed; audio audibility not assessed |
| Guide adapts for fewer choices | Two-choice target-retention test and live guide setting | At 360px, two displayed choices retained the correct circle |

## Numbered screenshot walkthrough

These are original browser captures. The browser tool returned JPEG data; filenames were corrected to `.jpg` without re-encoding. Original bytes and hashes are recorded in `screenshots/manifest.json`. Image dimensions are not a substitute for CSS viewport measurements.

1. [Shape transfer — smaller, turned square](screenshots/01-shapes.jpg). The target and all three choices are visible. Capture: 1280×720 pixels; the page title lies above this scrolled viewport.
2. [Sorting — completed second tray](screenshots/02-sorting.jpg). Dotted red and striped blue baskets contain their matching flowers; the completion feedback appears. Capture: 1280×720 pixels; the tool row continues below the captured viewport edge.
3. [Counting — three in two arrangements](screenshots/03-counting.jpg). Three reference flowers form a triangular cluster; three learner flowers form a row. Only the latest reference flower is outlined. Success feedback appears. Capture: 1280×1219 pixels.
4. [Mobile-width Shape beds](screenshots/04-mobile.jpg). The lesson is in the actual 360px-wide iframe; shape choices and tools fit the narrow column. The outer harness capture is 1280×1500 pixels and includes blank surrounding space. This is a browser frame test, not a physical phone screenshot.
5. [All activities explored](screenshots/05-summary.jpg). Three exploration marks, specific skill summaries and offline next practice are visible. Capture: 1280×966 pixels.

The full-page captures include unused background and have inconsistent apparent scale; they remain unaltered evidence of the displayed lesson. Width, control bounds and overflow conclusions should use the harness DOM measurements rather than image scale.

## Public preview

Live URL: [https://receiptwork-ma0914.github.io/receipt-cleanup-sample/sorting-garden/](https://receiptwork-ma0914.github.io/receipt-cleanup-sample/sorting-garden/).

At **2026-09-15 02:22:08 UTC**, root performed anonymous HTTP GETs without cookies or authentication for `index.html`, `app.mjs`, `model.mjs`, `style.css` and `assets/audio/shapes-demo.wav`. All five returned **200** with expected MIME types and SHA-256 hashes matching the reviewed local source. Those matches were rechecked against the final archive's source inputs. See [HTTP evidence](tests/browser/public-preview-http.json).

Root also opened the actual public URL in the browser and followed **Welcome → Garden map → Shape beds → My turn → Circle**. The live DOM showed **“Yes! Both are circles.”**, disabled completed choices and an active next button. See the preserved [public browser DOM](tests/browser/public-smoke.txt). The live site required no login. This is a public smoke check; the complete three-activity journeys and width matrix were performed locally as recorded above.

The deployed app was published from commit `bd29756bb875619166639016dea88f0dc236b01d`; GitHub Pages workflow run `34920791323` was reported successful by the root agent. [Deployment record](tests/browser/public-deployment.json). The complete source archive remains independently runnable if hosting disappears.

## Limitations

The reported interactions and layout matrix cover one Chromium-based browser. No audio listening/hardware test, physical touch-device test, alternate reduced-motion-preference emulation, child/efficacy study or comprehensive screen-reader audit was performed. Refresh initializes fresh state by source design; a separate post-progress refresh walkthrough was not recorded. Broader browser compatibility is a target, not an observed pass. Audio remains optional, and the no-motion default and visual instructions support the tested flows within these limits.
