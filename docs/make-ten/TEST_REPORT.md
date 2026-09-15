# Test report: Ten Little Seeds

## Evidence status

Automated source/model checks and agent-operated real-browser walkthroughs were performed on 15 September 2026 UTC. No children participated. Confirmed browser results and screenshots are recorded below; remaining checks are explicitly marked pending or limited. The public HTTPS preview and an agent-operated public-browser smoke test were also verified. Source and simulated-DOM tests are distinguished from real-browser observations.

## Public HTTPS verification

Preview: **[https://receiptwork-ma0914.github.io/receipt-cleanup-sample/make-ten/](https://receiptwork-ma0914.github.io/receipt-cleanup-sample/make-ten/)**. GitHub Pages workflow `34920791323` succeeded for source commit `bd29756bb875619166639016dea88f0dc236b01d`.

The [anonymous HTTP evidence](tests/browser/public-preview-http.json) was captured at **2026-09-15T02:22:08.836733+00:00**, using GET requests without cookies or authentication. The four Make Ten URLs checked (`index.html`, `app.js`, `styles.css`, `audio/quantity-0.mp3`) each returned HTTP 200 and matched the reviewed source bytes. This checks representative public assets; it is not an exhaustive network audit or a promise of future host uptime.

The separate [public-browser DOM snapshot](tests/browser/ten-public-smoke.txt) records the result of an agent-operated **Begin → My turn → check zero with Enter** smoke test. The empty ten-frame was accepted, Next discovery held focus, and both visible text and the accessible progressbar showed **1 of 16 discoveries**. The complete interaction walkthrough and nine viewport measurements below were performed locally against the reviewed source; only the described smoke flow was rerun on the public deployment. The archive documentation includes this later deployment evidence; the app code was unchanged.

## Automated results actually run

Environment: macOS; Node.js **24.19.0**. Command from the source folder:

```sh
node --test tests/*.test.cjs
```

Result after narration/focus updates: **17 tests passed, 0 failed**, 0 skipped. Ten pure-domain tests cover:

1. Building every numeral 0–10 into exactly ten distinct slots.
2. Zero treated as a valid target; null, undefined and empty-string targets rejected.
3. Starting at seven, adding three reaches ten; original seven preserved.
4. Removing four from nine yields five for different valid removal positions.
5. Five different make-ten pairs, including 0+10 and 5+5.
6. All six one-step story calculations and modeled operations stay within ten.
7. Fresh final model: seven to ten, then subtract two to reach eight.
8. Repeated Plant/Lift boundary inputs cannot exceed ten or go negative.
9. Invalid indices/starting states and out-of-range arithmetic are rejected or ignored safely.
10. 6,600 deterministic mixed state actions across all modes/starting counts preserve slot count, valid values, group bounds and immutable initial states.

Seven additional tests in `tests/ui-state.test.cjs` use a minimal simulated DOM, not a browser. They verify distinct progress and accessible progress text, wrong-answer/hint state preservation, enabled focus targets at boundaries, support changes and reset, the complete six-story/final two-phase controller journey, explicit/stoppable audio routing, blocked-audio fallback, and all 17 audio strings/SHA hashes. These tests cannot verify actual browser focus, layout or media playback.

Additional source check: `node --check app.js` passed. An initial development quoting error was corrected before this successful check; no browser pass is inferred from syntax validation.

The Python standard-library static build was run successfully. All local HTML script, stylesheet and document links resolved to included files. Built deployment files were compared byte-for-byte with their source. Inspection found no fetch/XHR/WebSocket or local/session-storage calls in the core JavaScript.

## Source-level accessibility audit

This audit reads the CSS and calculates explicit color pairs. It does not replace computed-layout, keyboard or assistive-technology testing. The original pale button/slot borders were strengthened before these final measurements. Full values and method are in `tests/contrast-evidence.json`.

| Element | CSS foreground / background | Contrast | Source threshold |
|---|---|---:|---:|
| Core text on page | `#153c35` / `#f5f1e5` | 10.75:1 | 4.5:1 |
| Core text on card | `#153c35` / `#fffdf7` | 11.94:1 | 4.5:1 |
| Primary button text | `#ffffff` / `#185648` | 8.52:1 | 4.5:1 |
| Eyebrow text | `#4d685a` / `#fffdf7` | 6.00:1 | 4.5:1 |
| Small text | `#4c6257` / `#fffdf7` | 6.47:1 | 4.5:1 |
| Footer text | `#566957` / `#f5f1e5` | 5.23:1 | 4.5:1 |
| Slot numeral | `#53694d` / `#fbfff2` | 5.92:1 | 4.5:1 |
| Strategy text | `#153c35` / `#edf2df` | 10.62:1 | 4.5:1 |
| Thinking card text | `#153c35` / `#f4ecd7` | 10.31:1 | 4.5:1 |
| Button/select boundary | `#607a55` / `#fffdf5` | 4.67:1 | 3:1 |
| Slot boundary against slot | `#607a55` / `#fbfff2` | 4.69:1 | 3:1 |
| Slot boundary against frame | `#607a55` / `#dfe9ce` | 3.78:1 | 3:1 |
| Focus ring on card | `#2556bd` / `#fffdf7` | 6.57:1 | 3:1 |
| Original seed centre | `#fffdf5` / `#246751` | 6.58:1 | 3:1 |
| Added seed centre | `#513700` / `#e7b342` | 5.76:1 | 3:1 |
| Active navigation text | `#153c35` / `#d7e9c8` | 9.47:1 | 4.5:1 |
| Welcome emphasis text | `#327151` / `#fffdf7` | 5.71:1 | 4.5:1 |

**Target-size source evidence:** `button, select, summary` have `min-height:48px`; `.slot` has both `min-width:48px` and `min-height:48px`, including the 420px breakpoint. The home/brand link now has `min-height:48px`. At the declared 360px viewport, CSS arithmetic leaves approximately 314px for the frame within the compact panel: five 48px slots plus four 4px gaps, 14px padding and 4px border require 274px. This is a source feasibility check, not a measured browser result. Decorative demonstration slots are 36px minimum and are not interactive controls. Adult text links are outside the child activity controls.

**Reduced-motion source evidence:** `@media(prefers-reduced-motion:reduce)` sets `scroll-behavior:auto!important`, `animation:none!important`, and `transition:none!important` on all elements/pseudo-elements. Core state changes require no animation, dragging or timing; no autoplay is present. Reduced-motion preference emulation was not performed; actual computed default-motion browser results are recorded below.

**Focus/progress source repairs:** successful Check focuses the revealed Next button. Plant/Lift disabling itself at a boundary focuses the opposite enabled action. Every render synchronizes the progress element value, fallback text, `aria-valuetext`, and visible count. Simulated-DOM assertions cover these targets; real-browser observations are recorded separately.

## Actual browser evidence

Browser user agent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36`; platform `MacIntel`, devicePixelRatio 2. An AI agent operated the browser and recorded the JSON and walkthrough results; these were not human learner trials.

**Geometry method:** real rendered same-origin iframe DOM measured at CSS widths 360, 768 and 1280, height 1000. These are CSS-width checks in a desktop browser, not physical mobile/tablet-device tests. Below-fold rendered buttons were included; the files separately report viewport intersection. Measurements were read-only and did not change settings.

| Evidence file | Client / scroll width | Smallest button W × H | Under 48px | Overflowing buttons | Nonzero motion elements |
|---|---:|---:|---:|---:|---:|
| [ten-1280-bonds.json](tests/browser/ten-1280-bonds.json) | 1280 / 1280 | 104.79 × 48 | 0 | 0 | 0 |
| [ten-1280-quantity.json](tests/browser/ten-1280-quantity.json) | 1280 / 1280 | 104.79 × 48 | 0 | 0 | 0 |
| [ten-1280-stories.json](tests/browser/ten-1280-stories.json) | 1280 / 1280 | 104.79 × 48 | 0 | 0 | 0 |
| [ten-360-bonds.json](tests/browser/ten-360-bonds.json) | 360 / 360 | 56 × 48 | 0 | 0 | 0 |
| [ten-360-quantity.json](tests/browser/ten-360-quantity.json) | 360 / 360 | 56 × 48 | 0 | 0 | 0 |
| [ten-360-stories.json](tests/browser/ten-360-stories.json) | 360 / 360 | 56 × 48 | 0 | 0 | 0 |
| [ten-768-bonds.json](tests/browser/ten-768-bonds.json) | 768 / 768 | 119.48 × 48 | 0 | 0 | 0 |
| [ten-768-quantity.json](tests/browser/ten-768-quantity.json) | 768 / 768 | 119.48 × 48 | 0 | 0 | 0 |
| [ten-768-stories.json](tests/browser/ten-768-stories.json) | 768 / 768 | 119.48 × 48 | 0 | 0 | 0 |

All nine documents had zero horizontal overflow and zero overflowing elements. Measurements were captured at 02:08:57–02:09:00 UTC. The browser’s reduced-motion preference was false and was not altered by the measurement harness: computed animations/transitions were already zero under that actual default preference. This does not claim an emulated reduced-motion or real-device test.

**Confirmed interactive walkthrough:** zero was checked with Enter and the visible Next button received focus. The 0+10, 5+5 and 7+3 bonds were completed; for seven, slots 8, 9 and 10 produced exactly ten. In the 9−4 story, noncontiguous slots 2/4/6/8 were removed and five remained. An incorrect Check preserved the model and offered a relevant strategy. Removing all six in 6−6 produced zero and focus moved to Plant one at the boundary. All six one-step stories and the final 7→10→8 challenge were completed; final equations and explanation were correct. The summary correctly showed 11/16 because five other discoveries were unvisited. Hint was used during the final challenge. In a separate fresh run, clicking the Helping hands combobox and using ArrowDown then Enter selected Let me explore; the guidance visibly changed to “Try your idea…” and the Hint button remained available. The earlier attempt to change mode during the final challenge did not establish a selected-value change and is not counted as evidence.

**Final fresh-run confirmations:** checking zero after a fresh load showed “1 of 16” in both visible text and the native progressbar accessible value, verifying the progress synchronization repair. Read aloud changed to the pressed Stop reading control; pressing it stopped playback and restored Read aloud. This verifies the explicit playback/stop UI flow, not listening quality. Start over → Keep garden preserved 1/16; subsequently confirming Start over returned to the welcome screen and a new start showed 0/16. Source-level control-border contrast was strengthened after the earlier captures without changing geometry.

## Acceptance example mapping

| Published example | Automated evidence | Manual browser evidence |
|---|---|---|
| Every displayed ten-frame has ten distinct slots; no duplicate counters | Tests 1, 8 and 10; each model array stays length ten with one value per slot | Pending: inspect activity, opening illustration and demonstration frames |
| From seven, add three; complete ten; show 7+3=10 | Test 3; make-ten content includes seven | Passed in agent-operated browser: start seven; slots 8/9/10; ten and 7+3=10; see screenshot 02 |
| Remove four from nine to produce five; never negative | Tests 4 and 8; second story is 9−4 | Passed in agent-operated browser: removed noncontiguous slots 2/4/6/8 from nine; five and 9−4=5; see screenshot 03 |
| Zero deliberately represented | Tests 1–2; first quantity target zero; story 6−6 ends zero | Passed in agent-operated browser: empty zero checked using Enter; 6−6=0 checked, Plant one received boundary focus |
| Retries preserve state/progress | Domain tests 8–10 plus simulated-DOM progress/reset/journey checks | Wrong check preserved model and strategy; navigated six stories/final; summary correctly 11/16. Cancel reset preserved 1/16; confirmed reset returned to welcome and a new start showed 0/16. Browser refresh with nonzero progress was not separately checked |
| Fresh final problem with optional hints and explanation | Test 7; final story defines the two phases | Passed in agent-operated browser: filled seven to ten, removed two, used Hint, checked eight with both equations/explanation; see screenshot 05 |

## Required manual checks to record

Use actual browser names/versions, date and observed outcomes. Do not substitute this checklist for completed evidence.

| Check | Steps | Status |
|---|---|---|
| 360px width | Real iframe DOM measurements across all three activities | Passed geometry/48px targets; physical touch device not tested |
| 768px width | Real iframe DOM measurements across all three activities | Passed geometry/48px targets; physical tablet not tested |
| 1280px width | Real iframe DOM measurements across all three activities | Passed geometry/48px targets |
| Keyboard | Zero Check using Enter; visible Next focus; Plant/Lift boundary focus | Confirmed for those actions; full Tab/Shift+Tab/Space traversal pending |
| Touch / non-drag operation | Native slot/Plant/Lift clicks in observed activities; minimum target size measured at mobile CSS width | Non-drag clicks and geometry verified; physical touchscreen not tested |
| Feedback / unlimited retry | Wrong Check preserved model and relevant strategy; final Hint and correct checks used | Confirmed observed actions; repeat stress additionally covered in automated tests |
| Reset / refresh | Cancel and confirm Start over from 1/16; restart from welcome | Cancel preserved 1/16; confirm/reset/new start showed 0/16. Refresh with nonzero progress not separately checked |
| Scaffold switch | Click native combobox, ArrowDown then Enter; inspect selected option, guidance and Hint | Let me explore selected; guidance changed; Hint remained available. Mid-progress preservation is additionally simulated-DOM tested |
| Reduced motion | Actual default browser preference and computed animation/transition states inspected in nine documents; source reduce rule audited | Zero computed motion; preference emulation not performed |
| Optional audio | Activate Read aloud then Stop reading; inspect control state | Explicit play/stop UI verified. Matching audio hashes/strings and unavailable fallback tested in simulated DOM. No auditory listening review or forced browser playback failure |
| Privacy / network | Source inspection for personal-data fields, analytics, storage, remote grading or child-facing external links | Core source has no data-entry fields, remote requests or storage calls. Browser network traffic audit not performed |
| Public HTTPS preview | Anonymous GET of four representative assets; public browser Begin → My turn → zero Check with Enter | Passed HTTP 200/source-byte checks and public zero smoke flow. Post-progress refresh and exhaustive document links were not separately checked in the public browser |

## Numbered screenshot walkthrough

These are actual browser captures, not recreated screens. JPEG bytes use `.jpg` filenames. Paired upper/lower captures are ordinary scrolled viewport screenshots, not stitched images. The 360px captures show the rendered iframe at the left of a wider desktop browser canvas; that unused canvas is not horizontal overflow within the app. The earlier full-page captures retain a known blank-area/duplicate-footer stitching artifact; their activity regions and equations remain visible.

1. **Quantity zero:** [upper viewport](screenshots/01-zero-upper.jpg) shows the zero target and verified Let me explore selection; [lower viewport](screenshots/01-zero-lower.jpg) shows zero success feedback and Next discovery. These are separate states in the walkthrough. An additional [full-page zero capture](screenshots/01-zero.jpg) is retained.
2. **[Make ten](screenshots/02-make-ten.jpg):** start with seven original seeds; click slots 8, 9 and 10; Check shows ten and `7 + 3 = 10`.
3. **[Subtraction story](screenshots/03-story.jpg):** start with nine; lift noncontiguous seeds in slots 2, 4, 6 and 8; Check shows five and `9 − 4 = 5`.
4. **Mobile CSS-width layout:** [360px upper viewport](screenshots/04-mobile-upper.jpg) shows the zero target and all ten distinct slots; [360px lower viewport](screenshots/04-mobile-lower.jpg) shows success feedback, full-width controls and the Next discovery focus ring. These are desktop-browser iframe captures, not a physical phone. Measured 360px geometry is included above.
5. **[Fresh final challenge](screenshots/05-final.jpg):** complete seven to ten, then lift two; Check shows eight and explains both steps.

## Interpretation limits

Passing calculation/state tests is not evidence of learning effectiveness, full WCAG conformance, or all-browser compatibility. The lesson targets generous controls, contrast and non-drag keyboard interactions. The recorded checks cover one desktop Chromium environment at three CSS widths; physical touch devices, a full keyboard/screen-reader traversal, auditory prompt quality and forced reduced-motion preference were not tested. All nine Make Ten layout records show zero actual animation/transition under the observed default preference. No remote grading or child testing is part of this report.
