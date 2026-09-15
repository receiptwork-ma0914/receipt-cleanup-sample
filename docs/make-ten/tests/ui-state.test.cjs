/* Simulated DOM/controller checks. These are NOT real-browser or layout tests. */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');

function harness(){
 const ids=new Map();let doc;
 class Element{
  constructor(id=''){this.id=id;this.dataset={};this.children=[];this.disabled=false;this.hidden=false;this.attrs={};this.listeners={};this._text='';this.value='';this.playCount=0;this.pauseCount=0;this.currentTime=0;this.subs={};this.classList={toggle(){}};}
  set textContent(v){this._text=String(v);}get textContent(){return this._text;}
  append(e){this.children.push(e);}
  addEventListener(name,fn){this.listeners[name]=fn;}
  setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return this.attrs[k]??null;}
  focus(){doc.activeElement=this;}
  querySelector(selector){return this.subs[selector]??=(new Element());}
  showModal(){this.open=true;}close(){this.open=false;}
  pause(){this.pauseCount++;}play(){this.playCount++;return Promise.resolve();}
  click(){if(this.disabled||this.hidden)return;this.focus();const event={preventDefault(){}};if(this.onclick)this.onclick(event);if(this.listeners.click)this.listeners.click(event);}
 }
 const el=id=>{if(!ids.has(id))ids.set(id,new Element(id));return ids.get(id);};
 const nav=['quantity','bonds','stories'].map(name=>{const e=new Element();e.dataset.nav=name;return e;});
 doc={activeElement:null,getElementById:el,createElement:()=>new Element(),querySelector:s=>el(s),querySelectorAll:s=>s==='[data-nav]'?nav:[]};
 el('support').value='together';el('read').setAttribute('aria-pressed','false');
 const ctx={document:doc,console,Set,Promise};ctx.window=ctx;vm.createContext(ctx);
 for(const name of ['model.js','content.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),ctx,{filename:name});
 const click=id=>el(id).click();const press=(id,n)=>{for(let i=0;i<n;i++)click(id);};
 return {el,click,press,nav,doc,ctx,start(){click('start');click('close-example');},go(name){nav.find(n=>n.dataset.nav===name).click();}};
}

test('Distinct progress is idempotent across repeated correct checks and retries',()=>{
 const h=harness();h.start();h.click('check');assert.equal(h.el('progress-text').textContent,'1 of 16 discoveries');assert.equal(h.el('progress').textContent,'1 of 16 discoveries');assert.equal(h.el('progress').getAttribute('aria-valuetext'),'1 of 16 discoveries');
 for(let i=0;i<10;i++)h.el('check').onclick();
 assert.equal(h.el('progress-text').textContent,'1 of 16 discoveries');
 h.click('retry');h.click('check');assert.equal(h.el('progress-text').textContent,'1 of 16 discoveries');
 assert.equal(h.doc.activeElement.id,'next');
});
test('Incorrect checks and hints preserve learner state; boundary actions keep focus usable',()=>{
 const h=harness();h.start();h.click('add');h.click('check');
 assert.equal(h.el('quantity-count').textContent,'1');assert.equal(h.el('next').hidden,true);assert.equal(h.el('progress').value,0);
 h.click('hint');assert.equal(h.el('quantity-count').textContent,'1');
 h.click('remove');assert.equal(h.el('quantity-count').textContent,'0');assert.equal(h.doc.activeElement.id,'add');
 h.press('add',10);assert.equal(h.el('quantity-count').textContent,'10');assert.equal(h.doc.activeElement.id,'remove');
});
test('Changing scaffold preserves count and progress; reset confirmation clears both',()=>{
 const h=harness();h.start();h.click('check');h.click('next');h.press('add',2);
 h.el('support').value='explore';h.el('support').onchange();assert.equal(h.el('quantity-count').textContent,'2');assert.equal(h.el('progress').value,1);
 h.click('reset');h.click('cancel-reset');assert.equal(h.el('quantity-count').textContent,'2');
 h.click('reset');h.click('confirm-reset');assert.equal(h.el('welcome').hidden,false);
 h.start();assert.equal(h.el('quantity-count').textContent,'0');assert.equal(h.el('progress').value,0);
});
test('Controller journeys all six stories and the new two-step final problem',()=>{
 const h=harness();h.start();h.go('stories');
 for(const t of h.ctx.LESSON.stories.slice(0,6)){
  h.press(t.op==='+'?'add':'remove',t.change);h.click('check');assert.equal(h.el('next').hidden,false);h.click('next');
 }
 assert.equal(h.el('quantity-count').textContent,'7');h.press('add',3);h.click('check');
 assert.equal(h.el('quantity-count').textContent,'10');assert.match(h.el('prompt').textContent,/Give 2 away/);
 assert.equal(h.el('next').hidden,true);h.press('remove',2);h.click('hint');h.click('check');
 assert.equal(h.el('quantity-count').textContent,'8');assert.match(h.el('feedback').textContent,/7 \+ 3 = 10, then 10 − 2 = 8/);
 assert.equal(h.el('progress').value,7);h.click('next');assert.equal(h.el('finish').hidden,false);assert.match(h.el('summary').textContent,/7 of 16/);
});
test('Bundled narration is explicit, stoppable and changes its source with the activity',()=>{
 const h=harness();h.start();const audio=h.el('narration');assert.equal(audio.playCount,0);
 h.click('read');assert.equal(audio.playCount,1);assert.equal(audio.src,'audio/quantity-0.mp3');assert.equal(h.el('read').textContent,'Stop reading');
 h.click('read');assert.equal(audio.playCount,1);assert.equal(h.el('read').textContent,'Read aloud');
 h.go('stories');assert.equal(audio.playCount,1);h.click('read');assert.equal(audio.src,'audio/story-1.mp3');
 h.go('bonds');assert.equal(h.el('read').textContent,'Read aloud');assert(audio.pauseCount>0);assert.equal(audio.playCount,2);
});
test('Failed narration leaves visible instructions and a usable retry button',async()=>{
 const h=harness();h.start();h.el('narration').play=()=>Promise.reject(new Error('Simulated audio blocked'));
 h.click('read');await new Promise(r=>setImmediate(r));
 assert.match(h.el('feedback').textContent,/Audio cannot play/);assert.equal(h.el('read').textContent,'Read aloud');assert.match(h.el('prompt').textContent,/Plant 0 seeds/);
});
test('All 17 narration assets match expected prompt strings and manifest hashes',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'audio/manifest.json'),'utf8'));
 assert.equal(manifest.files.length,17);
 const h=harness(),content=h.ctx.LESSON;
 const expected={};
 for(const n of content.quantities)expected[`quantity-${n}`]=`Plant ${n} seeds in the garden.`;
 for(const n of content.bonds)expected[`bonds-${n}`]=`${n} seeds are already here. How many more will fill ten?`;
 content.stories.slice(0,6).forEach((s,i)=>expected[`story-${i+1}`]=s.text);
 expected['final-1']='Start with 7 seeds. Fill all ten spaces. Then check your garden.';
 expected['final-2']='Ten seeds filled the garden. Give 2 away. How many stay?';
 for(const f of manifest.files){assert.equal(f.text,expected[f.id]);const data=fs.readFileSync(path.join(root,'audio',f.mp3));assert.equal(crypto.createHash('sha256').update(data).digest('hex'),f.mp3_sha256);}
});
