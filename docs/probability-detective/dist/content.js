'use strict';
window.ProbabilityContent = Object.freeze({
  independence: 'Yes. The chance is still 50%. In this model each flip is independent: earlier results do not alter the next flip. Tails is not owed a turn.',
  independenceHint: 'Imagine the coin has no memory. Does changing your notes change the coin itself?',
  independenceRetry: 'Try a counterexample: after five heads, the same fair coin could land heads again. Its setting is still 50%, so neither outcome is owed next. Try again.',
  diceHint: 'List ordered pairs: first die 1, second die 6; first die 2, second die 5. Keep going. Swapping different faces gives another equally likely pair.',
  diceCorrect: 'Exactly: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Six of the 36 equally likely ordered pairs make 7. Only (1,1) makes 2.',
  diceRetry: 'Count pairs, not just sum labels. For example, (1,6) and (6,1) are different results of two labelled dice. Sum 7 has six pairs; try the calculation again.',
  finalHint: 'For each side, multiply its chance of scoring by the points it earns. Compare the expected points per round, not only the scoring chances.',
  finalCorrect: 'Your evidence fits the rules: A averages 0.4 × 3 = 1.2 points per round; B averages 0.6 × 2 = 1.2. They have equal expected points. A short match can still finish with different totals.',
  finalRetry: 'Use both chance and reward: A has 40% × 3 = 1.2 expected points, and B has 60% × 2 = 1.2. More frequent scoring does not by itself mean an expected points advantage. Revise either choice and check again.'
});
