const test=require('node:test');
const assert=require('node:assert/strict');
const M=require('../model.js');
require('../content.js');
const C=globalThis.LESSON;

test('All numerals zero through ten match distinct occupied slots',()=>{
 for(let target=0;target<=10;target++){
  let s=M.create();for(let i=0;i<target;i++)s=M.plant(s);
  assert.equal(s.slots.length,10);assert.equal(M.count(s),target);assert(M.correct(s,target));
  assert.equal(s.slots.filter(Boolean).length,target);
 }
});
test('Zero is deliberate and neither missing nor invalid',()=>{
 const s=M.create();assert(M.correct(s,0));assert(!M.correct(s,null));assert(!M.correct(s,undefined));assert(!M.correct(s,''));
});
test('Seven plus three fills ten, without altering the original part',()=>{
 let s=M.create('add',7);const original=s;
 for(let i=0;i<3;i++)s=M.plant(s);
 assert.equal(M.count(s),10);assert.equal(s.slots.filter(x=>x===1).length,7);
 assert.equal(s.slots.filter(x=>x===2).length,3);assert(M.correct(s,10));
 assert.equal(M.count(original),7);assert.equal(M.toggle(s,0),s);
 assert.equal(M.plant(s),s);
});
test('Nine minus four leaves five; arbitrary valid removal positions count equally',()=>{
 let a=M.create('subtract',9),b=M.create('subtract',9);
 for(const i of [0,2,5,8])a=M.toggle(a,i);
 for(let i=0;i<4;i++)b=M.lift(b);
 assert.equal(M.count(a),5);assert.equal(M.count(b),5);assert(M.correct(a,5));assert(M.correct(b,5));
 assert.equal(M.result(9,'-',4),5);
});
test('All make-ten bonds include zero plus ten and five plus five',()=>{
 assert(C.bonds.includes(0));assert(C.bonds.includes(5));assert(new Set(C.bonds).size>=5);
 for(const n of C.bonds){let s=M.create('add',n);for(let i=n;i<10;i++)s=M.plant(s);assert.equal(M.count(s),10);assert.equal(s.slots.filter(x=>x===2).length,10-n);}
});
test('All six original one-step stories stay within zero to ten and can be modeled',()=>{
 const stories=C.stories.filter(s=>!s.final);assert(stories.length>=6);
 for(const t of stories){let s=M.create(t.op==='+'?'add':'subtract',t.start);for(let i=0;i<t.change;i++)s=t.op==='+'?M.plant(s):M.lift(s);assert(M.correct(s,M.result(t.start,t.op,t.change)));}
});
test('Fresh final problem combines making ten and subtraction',()=>{
 let s=M.create('add',7);for(let i=0;i<3;i++)s=M.plant(s);assert(M.correct(s,10));
 s=M.create('subtract',10);s=M.lift(M.lift(s));assert(M.correct(s,8));
});
test('Repeated boundary inputs cannot exceed ten or produce negative quantities',()=>{
 for(const mode of ['free','add','subtract'])for(let n=0;n<=10;n++){
  let s=M.create(mode,n);for(let i=0;i<50;i++)s=M.plant(s);assert(M.count(s)<=10);
  for(let i=0;i<50;i++)s=M.lift(s);assert(M.count(s)>=0);
  if(mode==='add')assert.equal(M.count(s),n);
 }
});
test('Invalid slot indices are ignored and invalid math cannot enter the model',()=>{
 const s=M.create();for(const i of [-1,10,100,NaN,1.5,'2',null])assert.equal(M.toggle(s,i),s);
 for(const args of [['free',-1],['free',11],['add',2.5],['bad',2]])assert.throws(()=>M.create(...args),RangeError);
 assert.throws(()=>M.result(0,'-',1),RangeError);assert.throws(()=>M.result(9,'+',2),RangeError);
});
test('Deterministic mixed-action retries preserve bounds, slot uniqueness and the initial state',()=>{
 let seed=17;const random=()=>{seed=(seed*48271)%2147483647;return seed;};
 for(const mode of ['free','add','subtract'])for(let initial=0;initial<=10;initial++){
  const fresh=M.create(mode,initial);let s=fresh;
  for(let i=0;i<200;i++){
   const action=random()%3;s=action===0?M.plant(s):action===1?M.lift(s):M.toggle(s,random()%10);
   assert.equal(s.slots.length,10);assert(s.slots.every(x=>[0,1,2].includes(x)));
   assert(M.count(s)>=0&&M.count(s)<=10);
   if(mode==='add'){assert(M.count(s)>=initial);assert(s.slots.slice(0,initial).every(x=>x===1));}
   if(mode==='subtract')assert(M.count(s)<=initial);
  }
  assert.equal(M.count(fresh),initial);assert.deepEqual(M.create(mode,initial),fresh);
 }
});
