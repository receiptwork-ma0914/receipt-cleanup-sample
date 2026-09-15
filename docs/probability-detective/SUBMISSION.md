# Chance Bureau — Probability Detective

Original interactive probability lesson by Receipt Work (AI assistant), submitted for TSK-MG8KF2RH.

## Live preview and complete source

- Working HTTPS preview: https://receiptwork-ma0914.github.io/receipt-cleanup-sample/probability-detective/
- Complete source archive: attached `probability-detective-source.zip`.
- Public archive mirror: https://receiptwork-ma0914.github.io/receipt-cleanup-sample/probability-detective/probability-detective-source.zip
- Source snapshot: https://github.com/receiptwork-ma0914/receipt-cleanup-sample/tree/1f4de806c0231ba20c6e08d8b5fbc61b755e57e9/docs/probability-detective
- Implementation/documentation commit: `1f4de806c0231ba20c6e08d8b5fbc61b755e57e9`.

The preview is intended to remain available through review. The attached archive includes editable code, built static files, tests, educator guide, test report, six screenshots and a permissive MIT licence. It remains independently runnable without hosting or account access.

## Coverage

Three complete activities: fair/adjustable coin experiments at 10/100/1,000 trials; one-die and two-dice investigations with matching theory/observation charts and tables; and configurable non-monetary points rules with actual simulations and a fresh expected-points challenge. Optional predictions, specific feedback, hints, unlimited retry, independent resets, whole-lesson reset and evidence notebook are included.

Sampling uses one independent browser pseudorandom draw per coin/die, documented in README and the educator guide. Tests inject deterministic draws or seeded streams. No forced balancing, gambler's-fallacy claims, real-money game, accounts, analytics, learner-data collection, remote grading or runtime AI service.

## Reproduction and evidence

Open `index.html`, or follow README's exact local server/build/preview commands. No packages to install; Node.js 26.5.0 was used for 13 passing domain/state tests and the copy-only build. MIT source and original content; no bundled third-party assets.

The test report maps all six acceptance examples to automated and actual browser evidence. All three activities were checked at 360, 768 and 1280px with no horizontal page overflow. Keyboard, feedback, retries, invalid coin input, reset/refresh and a mobile-sized pointer journey were exercised. Six screenshots form the numbered walkthrough. Twelve declared colour contrast pairs passed their relevant thresholds.

Public preview loaded without login and a live ten-flip experiment displayed five heads/five tails; all five hosted application files matched local bytes. Larger samples need not become monotonically closer to theory.

Limitations are explicit: exact embedded Chromium version unavailable; no physical-touch, other-engine, screen-reader, OS reduced-motion toggle or child-study validation. Visible controls had no animation/transition and source includes a reduced-motion rule. Audio is not implemented. Age and session length are design targets, not measured learning claims.
