/* Original probability models. Browser global and CommonJS; no dependencies. */
(function (root) {
  'use strict';
  function probability(p) {
    if (!Number.isFinite(p) || p < 0 || p > 1) throw new RangeError('Probability must be between 0 and 1.');
    return p;
  }
  function trials(n) {
    if (!Number.isInteger(n) || n < 1 || n > 10000) throw new RangeError('Trials must be an integer from 1 to 10,000.');
  }
  function draw(rng) {
    const x = rng();
    if (!Number.isFinite(x) || x < 0 || x >= 1) throw new RangeError('A random draw must be in [0, 1).');
    return x;
  }
  // Mulberry32: deterministic 32-bit state for reproducible teaching experiments.
  function seededRandom(seed) {
    if (!Number.isInteger(seed)) throw new TypeError('Seed must be an integer.');
    let state = seed >>> 0;
    return function () {
      state = (state + 0x6D2B79F5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function coin(n, p, rng = Math.random) {
    trials(n); probability(p);
    let heads = 0;
    const outcomes = [];
    for (let i = 0; i < n; i++) {
      const head = draw(rng) < p;
      outcomes.push(head ? 'H' : 'T');
      if (head) heads++;
    }
    return { n, p, heads, tails: n - heads, outcomes, proportion: heads / n };
  }
  function die(rng = Math.random) { return 1 + Math.floor(draw(rng) * 6); }
  function diceDistribution(two = true) {
    const counts = Array(two ? 11 : 6).fill(0);
    if (two) {
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) counts[a + b - 2]++;
    } else counts.fill(1);
    return counts.map((ways, i) => ({ value: i + (two ? 2 : 1), ways, probability: ways / (two ? 36 : 6) }));
  }
  function dice(n, two = true, rng = Math.random) {
    trials(n);
    const rows = diceDistribution(two).map(row => ({ ...row, count: 0 }));
    const outcomes = [];
    for (let i = 0; i < n; i++) {
      const a = die(rng), b = two ? die(rng) : 0, value = a + b;
      outcomes.push(two ? [a, b] : [a]);
      rows[value - (two ? 2 : 1)].count++;
    }
    return { n, two, rows: rows.map(row => ({ ...row, proportion: row.count / n })), outcomes };
  }
  function expectedPoints(waysA, totalWays, rewardA, rewardB) {
    if (!Number.isInteger(totalWays) || totalWays < 1 || totalWays > 10000 || !Number.isInteger(waysA) || waysA < 0 || waysA > totalWays) throw new RangeError('Scoring chances need valid whole-number parts of a total.');
    for (const reward of [rewardA, rewardB]) if (!Number.isInteger(reward) || reward < 1 || reward > 6) throw new RangeError('Rewards must be 1 to 6 points.');
    const numeratorA = waysA * rewardA, numeratorB = (totalWays - waysA) * rewardB;
    return { rewardA, rewardB, probabilityA: waysA / totalWays, probabilityB: (totalWays - waysA) / totalWays,
      expectedA: numeratorA / totalWays, expectedB: numeratorB / totalWays,
      advantage: numeratorA === numeratorB ? 'equal' : numeratorA > numeratorB ? 'A' : 'B' };
  }
  function rules(cutoff, rewardA, rewardB) {
    if (!Number.isInteger(cutoff) || cutoff < 1 || cutoff > 5) throw new RangeError('A needs 1 to 5 die faces.');
    return { cutoff, ...expectedPoints(cutoff, 6, rewardA, rewardB) };
  }
  function game(n, cutoff, rewardA, rewardB, rng = Math.random) {
    trials(n);
    const model = rules(cutoff, rewardA, rewardB);
    let turnsA = 0;
    const outcomes = [];
    for (let i = 0; i < n; i++) { const value = die(rng); outcomes.push(value); if (value <= cutoff) turnsA++; }
    return { ...model, n, turnsA, turnsB: n - turnsA, pointsA: turnsA * rewardA, pointsB: (n - turnsA) * rewardB, outcomes };
  }
  function freshState() { return { coin: false, dice: false, game: false }; }
  function markEvidence(state, activity) {
    if (!Object.hasOwn(state, activity)) throw new RangeError('Unknown activity.');
    return { ...state, [activity]: true };
  }
  const api = { probability, seededRandom, coin, die, diceDistribution, dice, expectedPoints, rules, game, freshState, markEvidence };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ProbabilityModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
