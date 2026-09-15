# Test report — Chance Bureau

Reviewed 15 September 2026. Automated checks used Node.js 26.5.0. Manual walkthroughs used the Codex in-app Chromium browser on macOS, served at `http://127.0.0.1:8794/`. Its exact Chromium version was not exposed by the test surface. No children were recruited or tested.

## Automated checks actually run

`node --test tests/domain.test.cjs`: **13 passed, 0 failed**, no skips. Explicit injected draws and seeded streams make these checks reproducible. Syntax checks of all three browser scripts and `node build.cjs` also passed. Build output is an untransformed copy of the five application files.

| Acceptance example | Automated evidence | Observed browser evidence |
| --- | --- | --- |
| Counts total requested trials; charts and tables agree | Independent recount of generated coin/dice outcomes at 10, 100 and 1,000; UI renders both from the same rows. | Fair coin samples were 5/5, 45/55 and 512/488 heads/tails, totalling 10, 100 and 1,000. Last sample cards/chart/table showed 51.2% heads. Two-dice 1,000-trial table total was 1,000; chart labels matched table percentages. |
| Coin probability zero/one behaves exactly | Boundary draws at 0, 0.5 and almost 1 give all tails/all heads as configured. | Adjustable 0%: 100 tails, zero heads. Adjustable 100%: 10 heads, zero tails. 101% rejected with a whole-number 0–100 message. |
| Fair chance stays one half after heads | Injected five-heads sequence leaves the next independent probability at 0.5. | “Tails is due” got a corrective counterexample; hint and retry to 50% gave the correct unchanged-setting explanation. |
| Die outcomes stay in range | Interval boundaries, all 36 ordered pairs and independently recounted sums tested. | One-die sample counts for faces 1–6 were 0,2,1,1,4,2. Two-dice sums stayed 2–12; theory showed 1,2,3,4,5,6,5,4,3,2,1 ways out of 36. |
| Sample size does not fabricate balance | Injected all-heads stream stays all heads for all three sizes, consuming exactly n draws. | Fresh samples and labelled history retained differing proportions. Text explicitly says improvement and exact balance are not guaranteed. |
| Final fairness follows published rules | All 180 valid die-game configurations checked using exact integer numerators; fresh token-game arithmetic tested. | Defaults gave A 2/6×1≈0.333 and B 4/6×1≈0.667. Changing A reward to 2 gave both ≈0.667. Fresh challenge explained 0.4×3 = 0.6×2 = 1.2. |

Additional automated coverage: seeded reproducibility, actual game points from generated faces, invalid parameters, idempotent progress and independent reset state. An independent code review checked all 36 dice pairs and 180 game configurations.

## Manual interaction results

- Start, case navigation, optional skipped predictions and notebook worked. Coin and dice 10/100/1,000 controls each generated fresh samples.
- Changing models cleared incompatible displayed results. Coin reset restored fair 50% and cleared history; dice reset retained theory with no actual counts; game reset cleared its arithmetic and final feedback.
- Wrong ordered-pair answer received an explanation; hint and retry to six succeeded. Final challenge rejected missing selections, explained a wrong claim and accepted equality with the expected-point calculation.
- Balanced game simulation at 1,000 rounds gave A 317 scoring rounds/634 points and B 683 rounds/683 points. The displayed observed rates were 0.634 and 0.683, distinct from the equal theoretical values.
- Completing the fresh challenge and both experiments produced three evidence notes with actual results, conclusions and next practice. Whole-lesson reset returned to onboarding; refresh started a new lesson.
- Keyboard: Enter activated start/reset/run buttons; native select arrows and Enter selected the adjustable coin; keyboard input set 70%; Enter ran ten flips. Tab then focused “100 flips” with a computed solid 3px outline. No drag gesture is required.
- Narrow-screen pointer walkthrough at 360×900: start, ten coin flips, dice navigation/ten rolls and game navigation/arithmetic inspection succeeded. Coin result was 3 heads/7 tails; dice counts totalled ten. This simulates a mobile-sized click journey; it is not a physical touchscreen or mobile-device test.
- Motion: inspected visible controls and main content after game calculation; computed animation names were `none` and transitions `0s`. Source includes a `prefers-reduced-motion: reduce` rule. Preference emulation was unavailable, so no OS reduced-motion toggle result is claimed. Core content has no audio dependency or animations to await.

Browser testing initially caught malformed HTML that removed the adjustable coin option. The option markup was corrected before the boundary, keyboard and final screenshot checks above.

## Responsive and contrast evidence

All three activities were measured at **360, 768 and 1280 CSS pixels**, height 900: nine page/width combinations. Document width equalled viewport width in all nine; no visible control was under 24px in either dimension in that geometry check. CSS targets 44px or larger controls. Normal vertical scrolling reaches longer content; screenshots show the initial viewport, not an entire page squeezed to fit.

`tests/contrast-calculations.json` records twelve declared CSS foreground/background pairs; each passed its relevant 4.5:1 text or 3:1 boundary/focus threshold. This is source-colour luminance math, not an exhaustive rendered contrast audit or formal WCAG certification.

Raw observed table text and geometry: `evidence/browser-checks.json`.

## Numbered screenshot walkthrough

1. `evidence/01-coins-1280.png`: select Coins after running fair samples at all three sizes. The theoretical 50% and observed 51.2% cards agree with 512 heads/488 tails and the bars/table.
2. `evidence/02-dice-1280.png`: select Dice after 1,000 two-dice trials. Observed and theoretical bars use the same scale; observed sum 7 is 19.6%, with full counts in the table below.
3. `evidence/03-game-1280.png`: select Fair game after balancing A's reward. Inspect the exact rule fractions and equal expected-point comparison.
4. `evidence/04-coin-360.png`: the coin controls stack into a readable single column at 360px; the page scrolls vertically.
5. `evidence/05-dice-360.png`: dice model and sample controls remain accessible in the narrow layout.
6. `evidence/06-game-360.png`: game rules remain readable and selectable in the narrow layout.

## Limits of this review

Other browser engines, physical touchscreens, screen readers, OS reduced-motion preference switching and child learning outcomes were not tested. Browser version targets in README are expected compatibility, not a claim of testing every listed browser. The walkthrough and domain tests support the specific results above; they do not establish universal accessibility or learning efficacy.
