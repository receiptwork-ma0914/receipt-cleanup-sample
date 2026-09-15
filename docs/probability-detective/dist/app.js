'use strict';
(() => {
  const M = window.ProbabilityModel, C = window.ProbabilityContent;
  const $ = id => document.getElementById(id);
  let progress = M.freshState(), coinHistory = [], coinResult = null, diceResult = null, gameResult = null, lastCoin = null, lastDice = null;
  const pct = p => `${(p * 100).toFixed(1).replace(/\.0$/, '')}%`;
  const num = x => Number.isInteger(x) ? String(x) : x.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
  const feedback = (id, text, type = '') => { $(id).textContent = text; $(id).className = `feedback ${type}`; };
  function updateProgress() {
    const count = Object.values(progress).filter(Boolean).length;
    $('progress').textContent = `${count} of 3 evidence notes collected`;
    $('summary-intro').textContent = count === 3 ? 'You investigated all three cases. Here is what your evidence can tell you.' : 'Your notebook grows as you run experiments and explain the fresh game. You can visit the cases in any order.';
    const notes = [
      ['coin', '01 / Coins', lastCoin ? `Last recorded sample: ${lastCoin.heads} heads in ${lastCoin.n} flips: ${pct(lastCoin.proportion)} observed, with a ${pct(lastCoin.p)} theoretical heads chance.` : 'Run a coin sample to record your own evidence.', 'A recent streak does not change the next independent flip. Larger samples are often more representative, but each comparison can vary.'],
      ['dice', '02 / Dice', lastDice ? `Last recorded sample: ${lastDice.n} trials for ${lastDice.two ? 'the sum of two dice' : 'one die'}. All counts come from those simulated rolls.` : 'Run a dice sample to record your own evidence.', 'Two dice have 36 equally likely ordered pairs. Six pairs make 7; just one pair makes 2.'],
      ['game', '03 / Fair game', progress.game ? 'Fresh case: 40% × 3 = 60% × 2 = 1.2 expected points for each team.' : 'Check a claim and matching evidence in the fresh token game.', 'Fairness here means equal expected points per round. It does not promise a tied short match.']
    ];
    $('notebook').innerHTML = notes.map(([key, title, evidence, learning]) => `<article class="panel"><div class="note-state">${progress[key] ? 'EVIDENCE COLLECTED' : 'READY TO INVESTIGATE'}</div><h3>${title}</h3><p>${evidence}</p><p>${learning}</p><button data-page="${key}">Return to case</button></article>`).join('');
  }
  function showPage(page, focus = true) {
    for (const name of ['coin', 'dice', 'game', 'summary']) $(`page-${name}`).hidden = name !== page;
    for (const button of document.querySelectorAll('nav [data-page]')) {
      if (button.dataset.page === page) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
    updateProgress();
    if (focus) { $(`${page}-title`).focus(); $(`${page}-title`).scrollIntoView({ block: 'start', behavior: 'auto' }); }
  }
  function record(activity) { progress = M.markEvidence(progress, activity); updateProgress(); }
  function chart(rows, hasObservation) {
    return '<div class="chart-legend"><span>Observed proportion</span><span>Theoretical probability</span></div><div class="chart-scale"><span>0%</span><span>50%</span><span>100%</span></div>' + rows.map(r => `<div class="chart-row"><span>${r.label}</span><div class="chart-track">${hasObservation ? `<div class="bar-observed" style="width:${r.proportion * 100}%"></div>` : ''}<div class="bar-theory" style="width:${r.probability * 100}%"></div></div><span>${hasObservation ? pct(r.proportion) : '—'}</span></div>`).join('');
  }
  function boundedInput(id, optional = false, max = 100, min = 0) {
    const input = $(id), raw = input.value.trim();
    const valid = (optional && raw === '' && !input.validity.badInput) || (raw !== '' && Number.isInteger(Number(raw)) && Number(raw) >= min && Number(raw) <= max && input.validity.valid);
    input.setAttribute('aria-invalid', String(!valid));
    if (!valid) throw new RangeError(`${input.labels[0].textContent}: enter a whole number from ${min} to ${max}${optional ? ', or leave it blank' : ''}.`);
    return raw === '' ? null : Number(raw);
  }
  function clearCoinResults() { coinResult = null; $('coin-results').hidden = true; $('coin-empty').hidden = false; updateProgress(); }
  function coinSettingsChanged() {
    const fair = $('coin-type').value === 'fair';
    $('coin-p').disabled = fair;
    if (fair) $('coin-p').value = '50';
    $('coin-setting').textContent = fair ? 'A fair coin has 50% heads and 50% tails on every independent flip.' : 'Adjustable model: 0% means always tails; 100% means always heads. At 50% it behaves like the fair model.';
    clearCoinResults();
    feedback('coin-status', 'The model changed. Predict and run a fresh sample; older samples stay labelled in the comparison table.');
  }
  function renderCoinHistory() {
    $('coin-history').innerHTML = coinHistory.length ? coinHistory.map(r => `<tr><td>${r.n.toLocaleString('en-US')}</td><td>${pct(r.p)}</td><td>${r.heads}</td><td>${r.tails}</td><td>${pct(r.proportion)}</td></tr>`).join('') : '<tr><td colspan="5">No samples yet.</td></tr>';
  }
  function runCoin(n) {
    try {
      const p = boundedInput('coin-p') / 100, prediction = boundedInput('coin-prediction', true);
      const result = M.coin(n, p); coinResult = result; lastCoin = result;
      coinHistory.unshift(result); coinHistory = coinHistory.slice(0, 6);
      $('coin-empty').hidden = true; $('coin-results').hidden = false;
      $('coin-theory').textContent = pct(p); $('coin-observed').textContent = pct(result.proportion);
      $('coin-fraction').textContent = `${result.heads} ÷ ${n.toLocaleString('en-US')} flips`;
      const rows = [{ label: 'H', name: 'Heads', count: result.heads, proportion: result.proportion, probability: p }, { label: 'T', name: 'Tails', count: result.tails, proportion: result.tails / n, probability: 1 - p }];
      $('coin-chart').innerHTML = chart(rows, true);
      $('coin-chart').setAttribute('aria-label', `Observed heads ${pct(result.proportion)}, tails ${pct(result.tails / n)}. Theoretical heads ${pct(p)}, tails ${pct(1 - p)}. Equivalent table follows.`);
      $('coin-table').innerHTML = rows.map(r => `<tr><th scope="row">${r.name}</th><td>${r.count}</td><td>${pct(r.proportion)}</td><td>${pct(r.probability)}</td></tr>`).join('') + `<tr><th scope="row">Total</th><td>${n}</td><td>100%</td><td>100%</td></tr>`;
      $('coin-sequence').textContent = `First ${Math.min(20, n)} actual flips: ${result.outcomes.slice(0, 20).join(' · ')}${n > 20 ? ' …' : ''}`;
      const predictionText = prediction === null ? 'Prediction skipped. ' : `You predicted ${prediction}% heads (${100 - prediction}% tails). `;
      feedback('coin-status', `${predictionText}This sample gave ${result.heads} heads and ${result.tails} tails. Observed heads: ${pct(result.proportion)}. The theoretical heads chance remains ${pct(p)}. A sample is evidence, not a promise for the next flip.`, 'success');
      renderCoinHistory(); record('coin');
    } catch (error) { clearCoinResults(); feedback('coin-status', error.message, 'error'); }
  }
  function diceSettingsChanged() {
    const two = $('dice-mode').value === 'two'; diceResult = null;
    const rows = M.diceDistribution(two);
    $('dice-prediction').innerHTML = '<option value="">Skip prediction for now</option><option value="equal">All outcomes are equally likely</option>' + rows.map(r => `<option value="${r.value}">${two ? 'Sum' : 'Face'} ${r.value}</option>`).join('');
    $('dice-explanation').textContent = two ? 'There are 36 equally likely ordered pairs. (1,6) and (6,1) are different pairs. Six pairs make 7, but only (1,1) makes 2. The 11 possible sums are not equally likely.' : 'One fair die has six equally likely faces: each has a 1 in 6 chance. A small sample can still have different counts for those faces.';
    feedback('dice-status', 'Predict first, or skip. Then run a sample. Changing the model clears earlier displayed results.');
    renderDice(); updateProgress();
  }
  function renderDice() {
    const two = $('dice-mode').value === 'two', rows = diceResult ? diceResult.rows : M.diceDistribution(two);
    $('dice-outcome-label').textContent = two ? 'Sum' : 'Face';
    $('dice-caption').textContent = `${two ? 'Two dice sums' : 'One die faces'}: ${diceResult ? `${diceResult.n} actual simulated trials` : 'theoretical distribution; no sample yet'}.`;
    $('dice-chart').innerHTML = chart(rows.map(r => ({ ...r, label: r.value })), !!diceResult);
    $('dice-chart').setAttribute('aria-label', `${two ? 'Two dice sums from 2 to 12' : 'Die faces from 1 to 6'}; ${diceResult ? `${diceResult.n} recorded trials` : 'theoretical probabilities only'}. Each bar uses the same values as the data table below.`);
    $('dice-table').innerHTML = rows.map(r => `<tr><th scope="row">${r.value}</th><td>${r.ways}/${two ? 36 : 6}</td><td>${pct(r.probability)}</td><td>${diceResult ? r.count : '—'}</td><td>${diceResult ? pct(r.proportion) : '—'}</td></tr>`).join('') + `<tr><th scope="row">Total</th><td>${two ? 36 : 6}/${two ? 36 : 6}</td><td>100%</td><td>${diceResult ? diceResult.n : '—'}</td><td>${diceResult ? '100%' : '—'}</td></tr>`;
  }
  function runDice(n) {
    const two = $('dice-mode').value === 'two', prediction = $('dice-prediction').value;
    diceResult = M.dice(n, two); lastDice = diceResult; renderDice(); record('dice');
    const maxCount = Math.max(...diceResult.rows.map(r => r.count));
    const leaders = diceResult.rows.filter(r => r.count === maxCount).map(r => r.value).join(', ');
    let text = prediction === '' ? 'Prediction skipped. ' : `Your prediction was ${prediction === 'equal' ? 'equal theoretical chances' : `${two ? 'sum' : 'face'} ${prediction}`}. `;
    text += `Most frequent in this sample: ${leaders} (${maxCount} each). `;
    text += two ? 'Theory: 7 is most likely because six pairs make it. A short sample need not have 7 in first place.' : 'Theory: all six faces have equal chance. Unequal observed counts can still come from a fair die.';
    feedback('dice-status', text, 'success');
  }
  function readGameRules() { return M.rules(Number($('game-cutoff').value), boundedInput('game-a', false, 6, 1), boundedInput('game-b', false, 6, 1)); }
  function gameSettingsChanged() {
    gameResult = null;
    const cutoff = Number($('game-cutoff').value);
    $('game-b-rule').textContent = `Team B scores on ${Array.from({ length: 6 - cutoff }, (_, i) => i + cutoff + 1).join(', ')}.`;
    $('game-theory').className = 'empty-state'; $('game-theory').innerHTML = '<p>Predict, then inspect the arithmetic.</p>';
    $('game-simulation-controls').hidden = true; $('game-result').textContent = 'No rounds run with these rules yet.';
    feedback('game-status', 'Rules ready. Predict an advantage, then inspect the arithmetic.');
  }
  function inspectGame() {
    try {
      const r = readGameRules(), prediction = $('game-prediction').value;
      $('game-theory').className = '';
      $('game-theory').innerHTML = `<div class="math-line"><strong>A:</strong> ${r.cutoff}/6 × ${r.rewardA} = <strong>${num(r.expectedA)} points per round</strong></div><div class="math-line"><strong>B:</strong> ${6 - r.cutoff}/6 × ${r.rewardB} = <strong>${num(r.expectedB)} points per round</strong></div><p class="verdict">${r.advantage === 'equal' ? 'Equal expected points' : `Team ${r.advantage} has an expected advantage`}</p><p class="quiet">Decimals are rounded to three places. The fraction calculations define the exact values. This comparison uses the rules, not a sample's totals.</p>`;
      $('game-simulation-controls').hidden = false;
      feedback('game-status', `${prediction ? prediction === r.advantage ? 'Your prediction matches the arithmetic. ' : 'Compare your prediction with the calculation. ' : 'Prediction skipped. '}${r.advantage === 'equal' ? 'The expected points match. Short-match totals can still differ.' : `Team ${r.advantage} has greater expected points. Try changing a reward to balance the expected points.`}`, prediction && prediction !== r.advantage ? '' : 'success');
      return r;
    } catch (error) { $('game-theory').className = 'empty-state'; $('game-theory').textContent = 'Correct the rules to calculate fairness.'; $('game-simulation-controls').hidden = true; feedback('game-status', error.message, 'error'); return null; }
  }
  function resetCoin() {
    $('coin-type').value = 'fair'; $('coin-p').value = '50'; $('coin-prediction').value = ''; $('coin-answer').value = '';
    for (const id of ['coin-p', 'coin-prediction']) $(id).removeAttribute('aria-invalid');
    coinHistory = []; lastCoin = null; progress.coin = false; coinSettingsChanged(); renderCoinHistory();
    feedback('coin-status', 'Coin experiment reset. Try 10 flips, then compare 100 and 1,000.'); feedback('coin-feedback', ''); updateProgress();
  }
  function resetDice() { $('dice-mode').value = 'two'; $('dice-answer').value = ''; lastDice = null; progress.dice = false; diceSettingsChanged(); feedback('dice-feedback', ''); updateProgress(); }
  function resetGame() {
    $('game-cutoff').value = '2'; $('game-a').value = '1'; $('game-b').value = '1'; $('game-prediction').value = ''; $('final-claim').value = ''; $('final-evidence').value = '';
    for (const id of ['game-a', 'game-b']) $(id).removeAttribute('aria-invalid');
    progress.game = false; gameSettingsChanged(); feedback('final-feedback', ''); updateProgress();
  }
  $('start').addEventListener('click', () => { $('welcome').hidden = true; $('lesson').hidden = false; showPage('coin'); });
  document.addEventListener('click', event => { const button = event.target.closest('[data-page]'); if (button) showPage(button.dataset.page); });
  for (const button of document.querySelectorAll('[data-coin-n]')) button.addEventListener('click', () => runCoin(Number(button.dataset.coinN)));
  for (const button of document.querySelectorAll('[data-dice-n]')) button.addEventListener('click', () => runDice(Number(button.dataset.diceN)));
  for (const button of document.querySelectorAll('[data-game-n]')) button.addEventListener('click', () => {
    const r = inspectGame(); if (!r) return;
    gameResult = M.game(Number(button.dataset.gameN), r.cutoff, r.rewardA, r.rewardB);
    feedback('game-result', `${gameResult.n} actual rounds: A scored in ${gameResult.turnsA} rounds for ${gameResult.pointsA} points (${num(gameResult.pointsA / gameResult.n)} per round observed). B scored in ${gameResult.turnsB} rounds for ${gameResult.pointsB} points (${num(gameResult.pointsB / gameResult.n)} per round observed). A short sample can disagree with the expected advantage.`, 'success');
  });
  $('coin-type').addEventListener('change', coinSettingsChanged); $('coin-p').addEventListener('input', coinSettingsChanged);
  $('dice-mode').addEventListener('change', diceSettingsChanged);
  for (const id of ['game-cutoff', 'game-a', 'game-b']) $(id).addEventListener(id === 'game-cutoff' ? 'change' : 'input', gameSettingsChanged);
  $('coin-check').addEventListener('click', () => feedback('coin-feedback', $('coin-answer').value === 'half' ? C.independence : $('coin-answer').value ? C.independenceRetry : 'Choose a next-flip chance first, or open the hint.', $('coin-answer').value === 'half' ? 'success' : ''));
  $('coin-hint').addEventListener('click', () => feedback('coin-feedback', C.independenceHint));
  $('dice-check').addEventListener('click', () => feedback('dice-feedback', $('dice-answer').value === '6' ? C.diceCorrect : $('dice-answer').value ? C.diceRetry : 'Choose a number of ordered pairs first, or open the hint.', $('dice-answer').value === '6' ? 'success' : ''));
  $('dice-hint').addEventListener('click', () => feedback('dice-feedback', C.diceHint));
  $('game-inspect').addEventListener('click', inspectGame); $('game-hint').addEventListener('click', () => feedback('game-status', 'Multiply each team’s fraction of scoring faces by its reward. With two scoring faces for A and four for B, try giving A twice as many points.'));
  $('final-hint').addEventListener('click', () => feedback('final-feedback', C.finalHint));
  $('final-check').addEventListener('click', () => {
    if (!$('final-claim').value || !$('final-evidence').value) return feedback('final-feedback', 'Choose both a claim and supporting evidence. The hint can help.');
    const finalModel = M.expectedPoints(40, 100, 3, 2);
    const correct = $('final-claim').value === finalModel.advantage && $('final-evidence').value === 'expected';
    feedback('final-feedback', correct ? C.finalCorrect : C.finalRetry, correct ? 'success' : '');
    if (correct) record('game');
  });
  $('coin-reset').addEventListener('click', resetCoin); $('dice-reset').addEventListener('click', resetDice); $('game-reset').addEventListener('click', resetGame);
  $('reset-all').addEventListener('click', () => { resetCoin(); resetDice(); resetGame(); for (const d of document.querySelectorAll('details')) d.open = false; progress = M.freshState(); updateProgress(); $('lesson').hidden = true; $('welcome').hidden = false; $('start').focus(); });
  diceSettingsChanged(); gameSettingsChanged(); updateProgress();
})();
