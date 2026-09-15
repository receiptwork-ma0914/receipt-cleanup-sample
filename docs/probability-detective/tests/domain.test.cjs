'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../domain.js');

test('seeded generator repeats the same stream, including seed zero', () => {
  for (const seed of [0, 1, 12, 4294967295]) {
    const a = M.seededRandom(seed), b = M.seededRandom(seed);
    for (let i = 0; i < 100; i++) { const x = a(); assert.equal(x, b()); assert.ok(x >= 0 && x < 1); }
  }
  assert.notDeepEqual(M.coin(100, .5, M.seededRandom(1)).outcomes, M.coin(100, .5, M.seededRandom(2)).outcomes);
});
test('coin counts, proportions and individual outcomes agree at every requested sample size', () => {
  for (const n of [10, 100, 1000]) for (const p of [0, .01, .4, .5, .7, .99, 1]) {
    const r = M.coin(n, p, M.seededRandom(12));
    assert.equal(r.heads + r.tails, n); assert.equal(r.outcomes.length, n);
    assert.equal(r.heads, r.outcomes.filter(x => x === 'H').length);
    assert.equal(r.tails, r.outcomes.filter(x => x === 'T').length);
    assert.equal(r.proportion, r.heads / n); assert.equal(r.p, p);
  }
});
test('probability zero and one are exact, even at random range boundaries', () => {
  for (const x of [0, .5, 1 - Number.EPSILON]) {
    assert.equal(M.coin(1000, 0, () => x).heads, 0);
    assert.equal(M.coin(1000, 1, () => x).heads, 1000);
  }
});
test('coin threshold uses a strict comparison and fair chance is unchanged after a streak', () => {
  const values = [0, .1, .2, .3, .4, .5]; let i = 0;
  const r = M.coin(6, .5, () => values[i++]);
  assert.deepEqual(r.outcomes, ['H', 'H', 'H', 'H', 'H', 'T']);
  assert.equal(r.p, .5);
  assert.equal(M.coin(1, .5, () => .2).outcomes[0], 'H');
});
test('larger samples use more actual draws; balancing is never injected', () => {
  let calls = 0;
  for (const n of [10, 100, 1000]) {
    const before = calls;
    const r = M.coin(n, .5, () => { calls++; return .1; });
    assert.equal(calls - before, n); assert.equal(r.heads, n); assert.equal(r.tails, 0);
  }
  const seeded = [10, 100, 1000].map(n => M.coin(n, .5, M.seededRandom(12)).heads);
  assert.notDeepEqual(seeded, [5, 50, 500]);
});
test('the two-dice theoretical model enumerates all 36 ordered pairs', () => {
  const r = M.diceDistribution(true);
  assert.deepEqual(r.map(x => x.ways), [1,2,3,4,5,6,5,4,3,2,1]);
  assert.deepEqual(r.map(x => x.value), [2,3,4,5,6,7,8,9,10,11,12]);
  assert.equal(r.reduce((s, x) => s + x.ways, 0), 36);
  assert.equal(r.find(x => x.value === 7).probability, 6/36);
  assert.equal(r.find(x => x.value === 2).probability, 1/36);
  assert.deepEqual(M.diceDistribution(false).map(x => x.probability), Array(6).fill(1/6));
});
test('die boundaries and six interval midpoints remain in 1–6', () => {
  assert.equal(M.die(() => 0), 1); assert.equal(M.die(() => 1 - Number.EPSILON), 6);
  for (let face = 1; face <= 6; face++) assert.equal(M.die(() => (face - .5) / 6), face);
});
test('one- and two-dice observed tables count only their actual generated outcomes', () => {
  for (const two of [false, true]) for (const n of [10, 100, 1000]) {
    const r = M.dice(n, two, M.seededRandom(731));
    assert.equal(r.rows.reduce((s, row) => s + row.count, 0), n);
    assert.equal(r.outcomes.length, n);
    for (const faces of r.outcomes) {
      assert.equal(faces.length, two ? 2 : 1);
      for (const face of faces) assert.ok(Number.isInteger(face) && face >= 1 && face <= 6);
    }
    for (const row of r.rows) {
      assert.equal(row.count, r.outcomes.filter(faces => faces.reduce((a,b) => a+b, 0) === row.value).length);
      assert.equal(row.proportion, row.count / n);
    }
  }
});
test('all game configurations calculate expected points from exact face/reward products', () => {
  for (let cut = 1; cut <= 5; cut++) for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) {
    const r = M.rules(cut, a, b);
    assert.equal(r.expectedA, cut * a / 6); assert.equal(r.expectedB, (6-cut) * b / 6);
    assert.equal(r.advantage, cut * a === (6-cut) * b ? 'equal' : cut * a > (6-cut) * b ? 'A' : 'B');
  }
  assert.equal(M.rules(2, 1, 1).advantage, 'B');
  assert.equal(M.rules(2, 2, 1).advantage, 'equal');
  assert.equal(M.rules(2, 3, 1).advantage, 'A');
});
test('game simulation allocates each round once and multiplies actual counts by rewards', () => {
  for (const n of [100, 1000]) {
    const r = M.game(n, 2, 2, 1, M.seededRandom(321));
    assert.equal(r.turnsA + r.turnsB, n);
    assert.equal(r.turnsA, r.outcomes.filter(face => face <= 2).length);
    assert.equal(r.pointsA, r.turnsA * 2); assert.equal(r.pointsB, r.turnsB);
    assert.equal(r.advantage, 'equal');
  }
  const allA = M.game(100, 2, 2, 1, () => 0);
  assert.equal(allA.pointsA, 200); assert.equal(allA.pointsB, 0); assert.equal(allA.advantage, 'equal');
});
test('invalid states are rejected rather than silently clamped', () => {
  for (const n of [0, -1, 1.5, NaN, 10001]) assert.throws(() => M.coin(n, .5), RangeError);
  for (const p of [-.1, 1.1, NaN, Infinity]) assert.throws(() => M.coin(10, p), RangeError);
  for (const x of [-.1, 1, NaN, Infinity]) assert.throws(() => M.die(() => x), RangeError);
  assert.throws(() => M.rules(0, 1, 1), RangeError); assert.throws(() => M.rules(6, 1, 1), RangeError);
  assert.throws(() => M.rules(2, 1.5, 1), RangeError); assert.throws(() => M.rules(2, 1, 7), RangeError);
});
test('progress collection is idempotent and reset creates independent empty state', () => {
  const initial = M.freshState(); const once = M.markEvidence(initial, 'coin');
  assert.deepEqual(M.markEvidence(once, 'coin'), once); assert.equal(initial.coin, false);
  const complete = M.markEvidence(M.markEvidence(once, 'dice'), 'game');
  assert.equal(Object.values(complete).filter(Boolean).length, 3);
  assert.deepEqual(M.freshState(), { coin: false, dice: false, game: false });
  assert.throws(() => M.markEvidence(initial, 'other'), RangeError);
});
test('fresh challenge exact tenths show equal expected points, not equal scoring chances', () => {
  const final = M.expectedPoints(40, 100, 3, 2);
  assert.equal(final.expectedA, 1.2); assert.equal(final.expectedB, 1.2);
  assert.equal(final.advantage, 'equal'); assert.notEqual(final.probabilityA, final.probabilityB);
  assert.equal(M.expectedPoints(40, 100, 4, 2).advantage, 'A');
  assert.equal(M.expectedPoints(40, 100, 1, 2).advantage, 'B');
  assert.equal(M.expectedPoints(0, 100, 3, 2).expectedA, 0);
  assert.equal(M.expectedPoints(100, 100, 3, 2).expectedB, 0);
  assert.throws(() => M.expectedPoints(101, 100, 3, 2), RangeError);
});
