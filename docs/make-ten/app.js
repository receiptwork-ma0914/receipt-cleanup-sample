/* Original client-only lesson UI. MIT licensed. */
(()=>{'use strict';
const M=TenModel,C=LESSON,$=id=>document.getElementById(id);
const sections={quantity:C.quantities,bonds:C.bonds,stories:C.stories};
const positions={quantity:0,bonds:0,stories:0};
const completed=new Set();let activity='quantity',state=M.create(),solved=false,finalStep=0,started=false;
let currentTarget=0,lastFeedback='You can take your time.';
const narration=$('narration');let audioToken=0;
const frame=$('ten-frame');
for(let i=0;i<10;i++){const b=document.createElement('button');b.className='slot';b.type='button';b.dataset.index=i;b.addEventListener('click',()=>act(s=>M.toggle(s,i)));frame.append(b);}
const demoFrame=document.querySelector('.demo-frame');for(let i=0;i<10;i++){const s=document.createElement('span');s.className='demo-slot';s.innerHTML=i<5?`<span class="seed ${i<3?'':'added'}"></span>`:'<span aria-hidden="true">·</span>';demoFrame.append(s);}
function key(){return `${activity}:${positions[activity]}`;}
function task(){return sections[activity][positions[activity]];}
function audioLabel(){ $('read').textContent='Read aloud';$('read').setAttribute('aria-pressed','false'); }
function stopAudio(){audioToken++;narration.pause();try{narration.currentTime=0;}catch{}audioLabel();}
function speak(){
  if($('read').getAttribute('aria-pressed')==='true'){stopAudio();return;}
  stopAudio();const token=audioToken;
  const name=activity==='quantity'?`quantity-${task()}`:activity==='bonds'?`bonds-${task()}`:task().final?`final-${finalStep+1}`:`story-${positions.stories+1}`;
  const failed=()=>{if(token!==audioToken)return;audioLabel();feedback('Audio cannot play here. The words are on the screen. You can read them together.');};
  narration.onended=()=>{if(token===audioToken)audioLabel();};narration.onerror=failed;
  narration.src=`audio/${name}.mp3`;$('read').textContent='Stop reading';$('read').setAttribute('aria-pressed','true');
  try{const playing=narration.play();if(playing&&playing.catch)playing.catch(failed);}catch{failed();}
}
function feedback(s,success=false){lastFeedback=s;$('feedback').textContent=s;$('feedback').classList.toggle('success',success);}
function strategy(){
  if(activity==='quantity')return currentTarget===0?'Zero means no seeds. An empty frame shows zero.':'Touch and count one seed at a time. Stop when the count matches the big number.';
  if(activity==='bonds')return 'The frame has ten spaces. Count the empty spaces. Plant one seed in each.';
  const t=task();if(t.final)return finalStep===0?'Fill each empty space first. Check your full garden.':'Your garden held ten. Lift two seeds, then count what stays.';
  return t.op==='+'?'Count the seeds already here. Plant the new seeds one at a time.':'Lift the seeds that leave. Count only the seeds that stay.';
}
function render(){
  const count=M.count(state),t=task();
  document.querySelectorAll('[data-nav]').forEach(b=>b.setAttribute('aria-current',b.dataset.nav===activity?'step':'false'));
  $('stage-label').textContent=activity==='quantity'?`GROW A NUMBER · ${positions.quantity+1} OF 4`:activity==='bonds'?`TWO PARTS MAKE TEN · ${positions.bonds+1} OF 5`:`GARDEN STORIES · ${positions.stories+1} OF 7`;
  $('activity-title').textContent=activity==='quantity'?`Can you grow ${currentTarget}?`:activity==='bonds'?"Let's make ten.":t.title;
  $('prompt').textContent=activity==='quantity'?`Plant ${currentTarget} ${currentTarget===1?'seed':'seeds'} in the garden.`:activity==='bonds'?`${t} ${t===1?'seed is':'seeds are'} already here. How many more will fill ten?`:t.final?(finalStep===0?'Start with 7 seeds. Fill all ten spaces. Then check your garden.':'Ten seeds filled the garden. Give 2 away. How many stay?'):t.text;
  $('scaffold').textContent=$('support').value==='together'?strategy():'Try your idea. The Hint button is here whenever you want it.';
  $('frame-instruction').textContent=state.mode==='add'?'Tap empty spaces to add seeds. Tap your added seeds to lift them.':state.mode==='subtract'?'Tap a seed to lift it. Tap its space to put it back.':'Tap a space to plant a seed. Tap a seed to lift it.';
  [...frame.children].forEach((b,i)=>{const n=state.slots[i];b.disabled=!M.allowed(state,i);b.setAttribute('aria-pressed',String(Boolean(n)));b.setAttribute('aria-label',`Space ${i+1}, ${n?(n===1?'original seed':'added seed'):'empty'}${b.disabled?(n?', stays in the garden':', outside this starting group'):n?', tap to lift':', tap to plant'}`);b.innerHTML=n?`<span aria-hidden="true" class="seed ${n===2?'added':''}"></span>`:`<span aria-hidden="true" class="slot-number">${i+1}</span>`;});
  $('quantity-count').textContent=count;$('quantity-words').textContent=count===1?'seed in the garden':'seeds in the garden';
  $('model-description').textContent=`${count} filled ${count===1?'space':'spaces'} and ${10-count} empty ${10-count===1?'space':'spaces'}.`;
  $('counter-key').hidden=activity==='quantity';
  $('model-note').textContent=activity==='quantity'?`Your target is ${currentTarget}. Your garden has ${count}.`:state.mode==='add'?`${state.start} already here. ${count-state.start} added. ${count} altogether.`:`${state.start} at the start. ${state.start-count} lifted. ${count} stay.`;
  $('equation').textContent=activity==='quantity'?`${count} ${count===1?'seed':'seeds'}`:state.mode==='add'?`${state.start} + ${count-state.start} = ${count}`:`${state.start} − ${state.start-count} = ${count}`;
  $('add').disabled=M.plant(state)===state;$('remove').disabled=M.lift(state)===state;
  $('check').hidden=solved;$('next').hidden=!solved;
  $('next').textContent=activity==='stories'&&positions.stories===6?'See my discoveries →':'Next discovery →';
  $('progress').value=completed.size;const progressText=`${completed.size} of 16 discoveries`;$('progress').textContent=progressText;$('progress').setAttribute('aria-valuetext',progressText);$('progress-text').textContent=progressText;
}
function setup(){stopAudio();solved=false;finalStep=0;const t=task();if(activity==='quantity'){currentTarget=t;state=M.create('free',0);}else if(activity==='bonds'){currentTarget=10;state=M.create('add',t);}else{currentTarget=t.final?10:M.result(t.start,t.op,t.change);state=M.create(t.op==='+'?'add':'subtract',t.start);}feedback('You can take your time.');render();}
function act(fn){const focused=document.activeElement;state=fn(state);if(solved){solved=false;feedback(`Your garden now has ${M.count(state)} seeds. Check your new idea when you are ready.`);}else feedback(`${M.count(state)} seeds in your garden. Check when you are ready.`);render();if(focused&&focused.disabled&&(focused.id==='add'||focused.id==='remove')){const other=$(focused.id==='add'?'remove':'add');if(!other.disabled)other.focus();else $('check').focus();}}
function begin(){started=true;$('welcome').hidden=true;$('finish').hidden=true;$('lesson').hidden=false;setup();$('activity-title').focus();}
function choose(name){activity=name;begin();}
function checkAnswer(){
 if(!M.correct(state,currentTarget)){const count=M.count(state);feedback(activity==='quantity'?`Your garden has ${count}. Look at the target ${currentTarget}. ${strategy()}`:activity==='bonds'?'Some spaces are still empty. Touch and count them one by one, then plant your seeds.':`Your model has ${count} seeds now. ${strategy()}`);return;}
 if(activity==='stories'&&task().final&&finalStep===0){stopAudio();finalStep=1;state=M.create('subtract',10);currentTarget=8;render();feedback('You filled ten! 7 and 3 made 10. Now give 2 seeds away.');return;}
 solved=true;completed.add(key());render();const count=M.count(state);
 feedback(activity==='quantity'?(count===0?'Yes! Zero means no seeds. An empty garden shows 0.':`Yes! You counted ${count} seeds. The numeral ${count} tells how many.`):activity==='bonds'?`Yes! ${state.start} and ${count-state.start} make ten. ${state.start} + ${count-state.start} = 10.`:task().final?'You did both steps! 7 + 3 = 10, then 10 − 2 = 8. Eight seeds stay in the garden.':`Yes! ${state.start} ${task().op==='+'?'plus':'minus'} ${task().change} equals ${count}. Your seeds show the story.`,true);$('next').focus();
}
function next(){if(!solved)return;if(positions[activity]<sections[activity].length-1){positions[activity]++;setup();$('activity-title').focus();}else if(activity==='quantity')choose('bonds');else if(activity==='bonds')choose('stories');else finish();}
function finish(){stopAudio();$('lesson').hidden=true;$('finish').hidden=false;$('summary').textContent=`You checked ${completed.size} of 16 discoveries. You can return to any garden and keep exploring.`;$('finish').querySelector('h1').setAttribute('tabindex','-1');$('finish').querySelector('h1').focus();}
function reset(){stopAudio();completed.clear();Object.keys(positions).forEach(k=>positions[k]=0);activity='quantity';state=M.create();solved=false;finalStep=0;started=false;$('lesson').hidden=true;$('finish').hidden=true;$('welcome').hidden=false;$('support').value='together';$('start').focus();}
$('start').onclick=()=>{begin();$('example').showModal();};$('close-example').onclick=()=>$('example').close();$('demo').onclick=()=>{stopAudio();$('example').showModal();};
$('home').onclick=e=>{e.preventDefault();if(started)$('reset-dialog').showModal();else $('start').focus();};
$('reset').onclick=()=>$('reset-dialog').showModal();$('cancel-reset').onclick=()=>$('reset-dialog').close();$('confirm-reset').onclick=()=>{$('reset-dialog').close();reset();};
$('support').onchange=render;$('add').onclick=()=>act(M.plant);$('remove').onclick=()=>act(M.lift);$('hint').onclick=()=>feedback(strategy());$('read').onclick=speak;
$('retry').onclick=setup;$('check').onclick=checkAnswer;$('next').onclick=next;$('replay').onclick=reset;$('return').onclick=()=>begin();
document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>choose(b.dataset.nav));
})();
