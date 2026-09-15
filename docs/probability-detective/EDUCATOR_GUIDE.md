# Chance Bureau: educator and co-play guide

## Purpose and prerequisites

Target: approximately age 12, while allowing for different reading, numeracy and access needs. Suggested length: **10–15 minutes**, with experiments replayable at any pace. This is a short investigation, not a complete probability curriculum or a validated assessment.

Helpful prerequisites: reading simple tables; whole-number addition and multiplication; the idea of a fraction as a part of a whole; and introductory percentages. The interface defines theoretical probability, observed proportion and trial. An adult can connect `6 ÷ 10` with `60%` before starting if needed.

By the end, learners should be able to:

1. Separate the model's theoretical probability from a sample's observed proportion.
2. Use counts and sample sizes as evidence, and explain why small samples can vary.
3. Compare samples of different sizes without claiming that each larger sample must be closer to theory.
4. Count ordered dice pairs and explain why sums are not equally likely.
5. Compare expected points under published rules and justify a fairness claim with arithmetic.
6. Explain why earlier independent outcomes do not change the chance of the next outcome.

## Suggested walkthrough

### Opening: one minute

Select **Open the case files**. Read the two central questions: “What should happen?” and “What did happen?” Explain that predictions are provisional. A blank prediction is allowed; learners may revise freely. There is no timer, penalty, ranking or competitive score for the learner.

### Case 1: coin laboratory, three to four minutes

**Demonstration.** Read the definitions panel and its worked example: six heads in ten is 60% observed, while a fair coin still has 50% theoretical heads chance. This is a labelled illustrative example, not purported experimental data.

**Guided practice.** Keep the fair model. Predict a heads percentage, then run 10 flips. Point out the theoretical and observed cards, counts and equal-source chart/table. Run 100 and 1,000, comparing the labelled rows in the sample-history table. Each run is a fresh sample, not an extension of the previous one. A sample can happen to be closer or farther from theory than another.

**Application.** Switch to the adjustable model and choose a heads chance such as 70%. Predict before collecting more evidence. Try 0% and 100% to test the model boundaries: these are deliberately deterministic settings. At 50%, the adjustable model behaves like the fair coin.

Use the five-heads reasoning check. An incorrect selection receives a counterexample and can be retried indefinitely. The correct explanation is that the model's next-flip probability stays 50%; a coin does not owe tails after heads.

### Case 2: dice investigation, three to four minutes

Begin with one die if learners need a simpler model: six faces, each with chance 1/6. Predict “All outcomes are equally likely,” run trials and discuss why counts may still differ.

Switch to sums of two dice. The displayed theory comes from enumeration of all 36 ordered pairs; each simulated trial generates two faces. Ask for a most-likely-sum prediction, then compare 10, 100 and 1,000 rolls. The horizontal bars show percentages on a common 0–100% scale. Filled bars mean observed; outlines mean theoretical. The complete adjacent table has the same numbers and also shows the number of ways.

Open the counting hint and complete the sum-7 check. List `(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)`. Distinguish two labelled dice: `(1,6)` and `(6,1)` are different ordered outcomes. Sum 2 has only `(1,1)`. Eleven possible sums therefore do not imply eleven equal probabilities.

### Case 3: fair-game designer, three to four minutes

This is a **fictional non-monetary points model**. Each round, one fair die chooses exactly one scoring team; the other gets zero. Fairness is explicitly defined as equal expected points per round. Other possible meanings of fairness, such as equal probability of winning a finite match, are outside this compact model.

**Demonstration.** Inspect the starting rules: A scores one point on 1–2; B scores one point on 3–6. A's expected points are `2/6 × 1 = 1/3`, versus B's `4/6 × 1 = 2/3`.

**Guided practice.** Predict the advantage, inspect the calculation, then change A's reward to two points. Now `2/6 × 2 = 4/6 × 1 = 2/3`. Run 100 or 1,000 actual simulated rounds. Explain why unequal observed totals do not alter the expected-point calculation.

**Fresh application.** The final challenge changes the random device to a digital token: 40% sun gives A three points; 60% cloud gives B two points. Ask for both a claim and supporting evidence. Each side has 1.2 expected points per round. Learners can revise either selection, open a hint and retry without penalty. Feedback uses the displayed rules; it does not pretend to understand arbitrary prose. An adult may invite an oral explanation without recording it in the app.

### Notebook: one minute

The notebook records the latest coin/dice evidence, the completed fresh game calculation and three conclusions. A note is collected by running a coin sample, running a dice sample, or correctly pairing the fresh-game claim with evidence. Notes are progress indicators, not an assessment score. Activity resets remove that activity's note; the whole-lesson reset clears everything without reloading.

The next-practice suggestion is a 70%-heads experiment at three sample sizes. Ask: “What do you know from the rules, and what have you observed so far?”

## Differentiation and access

- **More support:** co-read one paragraph at a time; use 10 trials first; connect counts to fractions before percentages; begin with one die; use the worked game example. Hints are freely available.
- **More depth:** ask learners to find several reward/face configurations with equal expected points, or explain why equal expected points can coexist with different scoring frequencies and different variability. Compare two fresh 1,000-trial samples and discuss finite-sample variation.
- **Motor/keyboard access:** all actions use native buttons, selects and inputs. No dragging, speed or precision gesture is required. Use Tab/Shift+Tab, arrows in selects, and Enter/Space on buttons. A skip link reaches the main content. Chart values also appear in tables.
- **Reading/visual access:** use browser zoom and the table alternatives. Labels and prose distinguish theory and observation in addition to colour. There is no forced animation, audio or flashing. The app has no narration feature; an adult may read aloud.
- **Co-play:** take turns predicting and explaining. Treat differences as discussion opportunities. Do not rank children by their random sample or by how quickly they finish.

## Model and arithmetic details

Browser `Math.random()` supplies a pseudorandom value in `[0,1)` per coin trial and per die. A coin is heads when that value is less than the configured probability. A face is `1 + floor(6 × value)`. The code stores actual outcomes and derives counts, proportions, charts and tables from those generated trials. It never balances counts after the fact. Separate draws model independent trials; physical imperfections and cryptographic randomness are not represented.

The domain tests inject explicit boundary values and a deterministic seeded generator. These reproduce results without making ordinary learner-facing runs fixed. Probability 0 and 1 are exact. Two-dice theory enumerates 36 ordered pairs. Game fairness compares integer products before converting fractions to rounded display decimals; this avoids a rounding-driven fairness decision.

Larger samples typically reduce the scale of proportion fluctuations in this model. Neither exact equality with theory nor step-by-step improvement is guaranteed. A sample by itself does not prove that a physical coin or die is fair. The app is not a gambling, prediction or diagnosis service.

## Content sources, checked 15 September 2026

The lesson uses original wording, examples and code. These adult-facing references support the mathematical content; no external content is loaded into the learner experience.

1. **OpenStax — “3.2 Independent and Mutually Exclusive Events,” Introductory Statistics.** https://openstax.org/books/introductory-statistics/pages/3-2-independent-and-mutually-exclusive-events  
   Supports the independence explanation: knowing one outcome does not change the probability of another independent outcome. Applied to the fair-coin streak check and separate die draws.

2. **OpenStax — “4.2 Mean or Expected Value and Standard Deviation,” Introductory Statistics 2e.** https://openstax.org/books/introductory-statistics-2e/pages/4-2-mean-or-expected-value-and-standard-deviation  
   Supports expected value as a probability-weighted average, comparison between empirical coin proportions and theoretical probabilities over many trials, and the 36-outcome sample space for two dice. Applied to the sample-size discussion and expected-points calculation. Our finite-sample cautions prevent interpreting long-run behaviour as guaranteed improvement after every batch.

3. **University of Cambridge NRICH — “Fair's Fair.”** https://nrich.maths.org/problems/fairs-fair  
   Supports reasoning about two-dice sums through the number of ways to obtain them. Applied to the dice investigation's contrast between one way to make 2 and six ways to make 7. Our game and interface are original; the NRICH activity is not copied.

## Privacy, limitations and offline follow-up

No names, demographics, email, account, payment, photos, audio, chat or learner prose are collected. State stays in page memory; there is no local storage or analytics. Refresh or closing the page clears progress. No children were recruited or tested for this submission. The intended age and session length are design targets, not universal suitability or measured learning-gain claims.

Offline follow-up: on paper, make a six-by-six grid for two labelled dice. Write each sum in its cell. Count the cells for 2, 7 and 12, then explain why the number of possible sum labels is insufficient to determine each sum's probability. This needs only paper and a pencil and no personal information.
